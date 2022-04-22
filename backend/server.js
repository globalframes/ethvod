const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const jsonfile = require('jsonfile')

console.log("Starting server...");

const server = restify.createServer({
    name: "globalframesserver",
    version: "0.0.1"
});

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: [
        /^http:\/\/localhost(:[\d]+)?$/
    ]
});

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.get("/test", (req, res) => {
    console.log(`Testing`);
    res.send(200, "Test OK");
});

server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
