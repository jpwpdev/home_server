const fetch = require('node-fetch');

const { JSDOM } = require('jsdom');
const { window } = new JSDOM("");
const { document } = (new JSDOM('')).window;
global.document = document;
const DOMParser = window.DOMParser;


module.exports = (config) => {
    const router = require("express").Router();
    const {spawn} = require("child_process");
    const fs = require("fs");
    const path = require("path");

    const logConnection = (endpoint, req, res, next) => {
        // Assuming 'config' is already defined and accessible in your context
        const logFilePath = path.resolve(config.serverInfo.logFile);
    
        // Get timestamp
        const timestamp = new Date().toISOString();
    
        // Get IP address of the connecting device
        // Note: 'req.ip' might show the proxy's IP. Use 'req.headers['x-forwarded-for']' if behind a proxy.
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'].split(',').pop();

        // try
        // {
        //     const ip = req.ip || req.headers['x-forwarded-for'].split(',').pop();
        // } catch (err) {console.error(err);}

        // const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.ip;
    
        // Collect other relevant information (customize as needed)
        const method = req.method;
        const url = req.originalUrl || req.url; // Depending on the middleware/framework being used
    
        // Construct the log string
        const logString = `${timestamp} - IP: ${ip} - Method: ${method} - URL: ${url}\n`;
        console.log(logString);
    
        // Append to log file asynchronously
        fs.appendFile(logFilePath, logString, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
                // res.status(500).send("ERROR LOGGING");
            }
            console.log("calling next");
            // Call next() whether logging succeeded or failed to not interrupt the request lifecycle
            next();
        });
    };

    const application = require("/home_server/server/application");

    Object.keys(config.pages).forEach((page) => {
        const currentPage = config.pages[page];
        const fn = path.join("/home_server", "server", "pages", currentPage.html);
        router.get(page, (req, res, next) => {
            logConnection(page, req, res, next);
        }, (req, res) => {
            fs.readFile(fn, (err, data) => {
                if(err)
                {
                    res.status(500).send("server error");
                }
                res.writeHead(200, {"Content-Type": "text/html"});
                res.write(data);
                res.end();
            });
        });
    });

    //================================================================================= fridge app ==================================================================================

    router.get("/fridgeData", (req, res, next) => {
        logConnection("/fridgeData", req, res, next);
    }, (req, res) => {
        // fs.readFile("./apps/fridgeApp/fridgeApp.json", "utf-8", (err, data) => {
        //     if(err)
        //     {
        //         res.status(500).send("null");
        //     }
        //     res.status(200).json(JSON.parse(data));
        // });

        const myApp = application("fridgeApp");
        myApp.get(req, res);
    });

    router.post("/fridgeData", (req, res, next) => {
        logConnection("/fridgeData", req, res, next);
    }, (req, res) => {
        
        // fs.writeFile("./apps/fridgeApp/fridgeApp.json", JSON.stringify(req.body), (err) => {
        //     if(err)
        //     {
        //         res.status(500).json({response: "FAILED"});
        //     }
            
        //     res.status(200).json({response: "OK"});
        // });
        const myApp = application("fridgeApp");
        myApp.post(req, res);
    });

    //================================================================================= fridge app ==================================================================================

    //=============================================================================== checklist app =================================================================================

    router.get("/choreData", (req, res, next) => {
        const connectionData = {
            req: req,
            res: res,
            next: next
        };
        logConnection("/choreData/", req, res, next);
    }, (req, res) => {
        const myApp = application("choreApp");
        myApp.get(req, res);
    });

    router.post("/choreData", (req, res, next) => {
        logConnection("/choreData", req, res, next);
    }, (req, res) => {
        const myApp = application("choreApp");
        myApp.post(req, res);
    });

    //=============================================================================== checklist app =================================================================================

    router.get("/", (req, res, next) => {
        logConnection("/", req, res, next);
    }, (req, res) => {
        fs.readFile(path.join("/home_server/server/pages/index.html"), "utf-8", (err, data) => {
            if(err)
            {
                res.status(500).send("Error");
            }
            res.status(200).send(data);
        })
    });

    //================================================================================ roku remote ==================================================================================

    const rokuMapping = {
        "Living Room Roku": "10.0.0.215",
        "Bedroom Roku": "10.0.0.90"
    };

    router.get("/rokuRemote", (req, res, next) => {
        logConnection("/rokuRemote", req, res, next);
    }, (req, res) => {
        fs.readFile(path.join("/home_server", "server", "pages", "rokuRemote.html"), "utf-8", (e, data) => {
            if(e)
            {
                res.status(500).send("Error");
            }
            res.status(200).send(data);
        });
    });

    router.get("/rokuRemote/search", (req, res, next) => {
        logConnection("/rokuRemote/search", req, res, next);
    }, async (req, res) => {
        const rokuIP = '10.0.0.90'; // Replace this with the actual IP address of your Roku device
        let command = req.body.command;

        // Ensure there's a command and potentially validate it
        if (!command) {
            return res.status(400).send({ error: 'Command not specified' });
        }

        if(command.includes('?')) {
            const [basePath, queryParams] = command.split('?');
            command = `${basePath}?${encodeURIComponent(queryParams)}`;
        }

        try {
            const commandIP = `http://${rokuIP}:8060/${command}`;
            console.log(commandIP);
            const rokuResponse = await fetch(commandIP, {
                method: 'GET',
                headers: {
                    // Include headers if Roku API requires them
                }
            });

            if (!rokuResponse.ok) throw new Error('Failed to communicate with Roku device.');

            res.status(200).send({ success: true, message: 'Command sent successfully.' });
        } catch (error) {
            console.error('Error sending command to Roku:', error);
            res.status(500).send({ success: false, error: error.message });
        }
    });

    router.post("/rokuRemote", (req, res, next) => {
        logConnection("/rokuRemote", req, res, next);
    }, async (req, res) => {
        const rokuIP = '10.0.0.90'; // Replace this with the actual IP address of your Roku device
        let command = req.body.command;

        // Ensure there's a command and potentially validate it
        if (!command) {
            return res.status(400).send({ error: 'Command not specified' });
        }

        if(command.includes('?')) {
            const [basePath, queryParams] = command.split('?');
            command = `${basePath}?${encodeURIComponent(queryParams)}`;
        }

        try {
            const commandIP = `http://${rokuIP}:8060/${command}`;
            console.log(commandIP);
            const rokuResponse = await fetch(commandIP, {
                method: 'POST',
                headers: {
                    // Include headers if Roku API requires them
                }
            });

            if (!rokuResponse.ok) throw new Error('Failed to communicate with Roku device.');

            res.status(200).send({ success: true, message: 'Command sent successfully.' });
        } catch (error) {
            console.error('Error sending command to Roku:', error);
            res.status(500).send({ success: false, error: error.message });
        }
    });

    router.get("/rokuRemote/populateAppList", (req, res, next) => {
        logConnection("/rokuRemote/populateAppList", req, res, next);
    }, async (req, res) => {
        const rokuIP = '10.0.0.90'; // Replace this with the actual IP address of your Roku device
        
        try {
            const response = await fetch(`http://${rokuIP}:8060/query/apps`);
            const text = await response.text();
            const data = new DOMParser().parseFromString(text, "text/xml");
            const apps = Array.from(data.querySelectorAll('app')).map(app => ({
                id: app.getAttribute('id'),
                name: app.textContent
            }));
    
            res.status(200).json({apps});
        } catch (error) {
            console.error('Error fetching apps from Roku:', error);
            res.status(500).send({ success: false, error: error.message });
        }
    });

    //================================================================================ roku remote ==================================================================================

    //================================================================================= task list ===================================================================================

    router.get("/taskListData", (req, res, next) => {
        const connectionData = {
            req: req,
            res: res,
            next: next
        };
        logConnection("/taskList", req, res, next);
    }, (req, res) => {
        const myApp = application("taskList");
        myApp.get(req, res);
    });

    router.post("/taskListData", (req, res, next) => {
        logConnection("/taskList", req, res, next);
    }, (req, res) => {
        const myApp = application("taskList");
        myApp.post(req, res);
    });

    //================================================================================= task list ===================================================================================

    return router;
};
