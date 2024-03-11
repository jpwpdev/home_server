const announceConnection = (endpoint, next) => {
    console.log(`Connection at endpoint ${endpoint}`);
    next();
};

async function asyncFunction(pool) {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT 1 as val");
        console.log(rows); //[ {val: 1}, meta: ... ]
        // Use conn to execute further queries
    } catch (err) {
        throw err;
    } finally {
        if (conn) conn.end(); //release to pool
    }
}

module.exports = (config) => {
    const router = require("express").Router();
    const {spawn} = require("child_process");
    const fs = require("fs");
    const path = require("path");
    const mongoose = require('mongoose');
    const mariadb = require('mariadb');

    const pool = mariadb.createPool(config.serverInfo.db.pool);

    mongoose.connect('mongodb://localhost/fridgeApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

    const { Schema, model } = mongoose;

    const itemSchema = new Schema({
        category: String,
        items: [String]
    });

    const FridgeItem = model('FridgeItem', itemSchema);


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

    router.post("/fridgeData", async (req, res) => {
        // Assuming req.body is structured as { category: String, items: [String] }
        try {
            const { category, items } = req.body;
    
            // Update the document for the given category, or insert if it doesn't exist
            const result = await FridgeItem.findOneAndUpdate({ category }, { category, items }, { new: true, upsert: true });
    
            console.log(result); // Debugging: See the result of the operation
            res.status(200).json({response: "OK"});
        } catch (err) {
            console.error(err); // Debugging: Log any errors
            res.status(500).json({response: "FAILED"});
        }
    });    

    return router;
};
