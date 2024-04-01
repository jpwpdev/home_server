module.exports = (config) => {
    const router = require("express").Router();
    const {spawn} = require("child_process");
    const fs = require("fs");
    const path = require("path");

    const logConnection = (req, res, next) => {
        // Assuming 'config' is already defined and accessible in your context
        const logFilePath = path.resolve(config.serverInfo.logFile);
    
        // Get timestamp
        const timestamp = new Date().toISOString();
    
        // Get IP address of the connecting device
        // Note: 'req.ip' might show the proxy's IP. Use 'req.headers['x-forwarded-for']' if behind a proxy.
        const ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'].split(',').pop();
    
        // Collect other relevant information (customize as needed)
        const method = req.method;
        const url = req.originalUrl || req.url; // Depending on the middleware/framework being used
    
        // Construct the log string
        const logString = `${timestamp} - IP: ${ip} - Method: ${method} - URL: ${url}\n`;
    
        // Append to log file asynchronously
        fs.appendFile(logFilePath, logString, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
            // Call next() whether logging succeeded or failed to not interrupt the request lifecycle
            next();
        });
    };

    const application = require("/home_server/server/application");

    Object.keys(config.pages).forEach((page) => {
        const currentPage = config.pages[page];
        const fn = path.join("/home_server", "server", "pages", currentPage.html);
        router.get(page, (req, res, next) => {
            logConnection(page, next);
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
        logConnection("/fridgeData", next);
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
        logConnection("/fridgeData", next);
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
        logConnection("/choreData/", next);
    }, (req, res) => {
        const myApp = application("choreApp");
        myApp.get(req, res);
    });

    router.post("/choreData", (req, res, next) => {
        logConnection("/choreData", next);
    }, (req, res) => {
        const myApp = application("choreApp");
        myApp.post(req, res);
    });

    //=============================================================================== checklist app =================================================================================

    return router;
};
