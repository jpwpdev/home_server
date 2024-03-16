const fs = require("fs");

const Application = {
    appName: "",
    get: function (req, res, next) {
        fs.readFile(`apps/${this.appName}/app.json`, "utf-8", (err, data) => {
            if(err)
            {
                res.status(500).send("null");
            }
            res.status(200).json(JSON.parse(data));
        });
    },
    post: function (req, res, next) {
        fs.writeFile(`apps/${this.appName}/app.json`, JSON.stringify(req.body), (err) => {
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

module.exports = createApplication;
