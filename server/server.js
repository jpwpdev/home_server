const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");
const https = require("https");
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());

app.use(express.static("static"));

const routes = require(path.join("/home_server", "server", "routes"));
const config = JSON.parse(fs.readFileSync(path.join("/home_server", "server", "config.json")));

app.use(routes(config));

// Load SSL key and certificate
const privateKey = fs.readFileSync(config.serverInfo.key, 'utf8');
const certificate = fs.readFileSync(config.serverInfo.cert, 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app); // Use HTTPS server

const port = config.serverInfo.port;
const host = config.serverInfo.host;

httpsServer.listen(port, host, () => {
    console.log(`running on https://${host}:${port}`);
});
