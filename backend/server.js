const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const jsonfile = require('jsonfile')
const Accounts = require('web3-eth-accounts');
const accounts = new Accounts();
const fs = require('fs');
const axios = require('axios');
const API_TOKEN = process.env.API_TOKEN;

console.log("Starting server...");
console.log(`API token: "${API_TOKEN}"`)

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

// 
server.get("/subscribed/:address", (req, res) => {
    console.dir(req.params)
    const address = req.params.address
    result = isSubscribed(address)
    res.send(200, result);
});

const subscriptionCashFileName = "subscriptions_cache.json"
const isSubscribed = (address) => {
    // TODO superfluid

    return {
        address: address,
        subscribed: true
    }
}

const createUploadUrl = async (title) => {
    console.log("LivePeer API call: " + title + " " + API_TOKEN)
    const api = 'https://livepeer.com/api/asset/request-upload'
    try {
        const res = await axios.post(api, {
            name: title,
        }, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        // console.log(res)
        return res.data;
    } catch(e) {
        console.log(e)
        return {};
    }
}

server.post("/upload", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        const { address, signature, title, videofile, token_gate_contracts } = req.body;

        // Check signature
        const hash = "\x19Ethereum Signed Message:\n" + CHALLENGE.length + CHALLENGE;
        const recoveredAddress = accounts.recover(hash, signature).toLowerCase()
        const originalAddress = address.toLowerCase();
        if (recoveredAddress !== originalAddress) {
            //TODO: return res.send(403, "invalid signature");
        }

        // Check subscription
        if (!isSubscribed(recoveredAddress)) {
            //TODO: return res.send(403, "missing subscription");
        }

        // Upload video to LivePeer
        createUploadUrl(title).then(res => {
            console.log(res)
            url = res.url
        }
        )

        // rpd(req.body.command).then((stdout) => {
        //     res.send(200, stdout);
        //     return next();
        // }).catch((e) => {
        //     res.send(500, e);
        //     return next();
        // })

        res.send(200, "TODO");
    }
});


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
