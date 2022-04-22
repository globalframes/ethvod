const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const jsonfile = require('jsonfile')
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();

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

const CHALLENGE = "f6129a2dc6c41ef6d6af"

server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());

server.get("/test", (req, res) => {
    console.log(`Testing`);
    res.send(200, "Test OK");
});

server.get("/challenge", (req, res) => {
    res.send(200, `${CHALLENGE}`);
});


server.get("/r", (req, res) => {
    res.send(200, `${CHALLENGE}`);
});


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
    const challenge = "Hello world";
    const signature = "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
    const recoveredAddress = accounts.recover(challenge, signature)
    console.log(recoveredAddress)
});
