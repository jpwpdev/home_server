const announceConnection = (endpoint, next) => {
    console.log(`Connection at endpoint ${endpoint}`);
    next();
};

module.exports = (config) => {
    const router = require("express").Router();
    const {spawn} = require("child_process");
    const fs = require("fs");
    const path = require("path");

    Object.keys(config.pages).forEach((page) => {
        const currentPage = config.pages[page];
        const fn = path.join("pages", currentPage.html);
        router.get(page, (req, res, next) => {
            announceConnection(page, next);
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

    router.get("/fridgeData", (req, res, next) => {
        announceConnection("/fridgeData", next);
    }, (req, res) => {
        fs.readFile("./apps/fridgeApp.json", "utf-8", (err, data) => {
            if(err)
            {
                res.status(500).send("null");
            }
            res.status(200).json(JSON.parse(data));
        });
    });

    router.post("/fridgeData", (req, res, next) => {
        announceConnection("/fridgeData", next);
    }, (req, res) => {
        
        fs.writeFile("./apps/fridgeApp.json", JSON.stringify(req.body), (err) => {
            if(err)
            {
                res.status(500).json({response: "FAILED"});
            }
            
            res.status(200).json({response: "OK"});
        });
    });

    return router;
};
