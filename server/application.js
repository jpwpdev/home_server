const fs = require("fs");

const Application = {
    appName: "",
    get: (req, res, next) => {
        fs.readFile(`apps/${appName}/app.json`, "utf-8", (err, data) => {
            if(err)
            {
                res.status(500).send("null");
            }
            res.status(200).json(JSON.parse(data));
        });
    },
    post: (req, res, next) => {
        fs.writeFile(`apps/${appName}/app.json`, JSON.stringify(req.body), (err) => {
            if(err)
            {
                res.status(500).json({response: "FAILED"});
            }
            
            res.status(200).json({response: "OK"});
        });
    }
};

const createApplication = (appName) => {
    let app = Object.create(Application);

    app.appName = appName;

    return app
};
