const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const jsonfile = require('jsonfile')
const Accounts = require('web3-eth-accounts');
const FormData = require('form-data')
const accounts = new Accounts();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config()
const API_TOKEN = process.env.API_TOKEN;

const JSONdb = require('simple-json-db');
const db = new JSONdb('storage.json');

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
    } catch (e) {
        console.log(e)
        return {};
    }
}

// const uploadVideo = async (url, video) => {
//     try {



//         // const formData = new FormData();
//         //     formData.append(
//         //     "videoFile",
//         //     fs.createReadStream(video.path),
//         //     video.name
//         // );
//         const res = await axios.put(url, fs.createReadStream(video.path), {
//             headers: { "contentType": file.}
//         });
//         // console.log(res)
//         return res.data;
//     } catch (e) {
//         console.log(e)
//         return {};
//     }

//     // --data-binary '@$VIDEO_FILE_PATH'
// }

const exportToIpfs = async (asset_id) => {
    try {
        const url = `https://livepeer.com/api/asset/${asset_id}}/export`
        const res = await axios.put(url, { ipfs: {} }, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        // console.log(res)
        return res.data;
    } catch (e) {
        console.log(e)
        return {};
    }
}

server.post("/upload", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        var { address, /*signature,*/ title/*, token_gate_contracts*/ } = req.body;
        const videofile = req.files.videoFile

        if (!title)
            title = "placeholdertitl" //TODO
        // Check signature
        // const hash = "\x19Ethereum Signed Message:\n" + CHALLENGE.length + CHALLENGE;
        // const recoveredAddress = accounts.recover(hash, signature).toLowerCase()
        // const originalAddress = address.toLowerCase();
        // if (recoveredAddress !== originalAddress) {
        //     //TODO: return res.send(403, "invalid signature");
        // }
        recoveredAddress = address

        // Check subscription
        if (!isSubscribed(recoveredAddress)) {
            //TODO: return res.send(403, "missing subscription");
        }

        // Upload video to LivePeer
        createUploadUrl(title).then(async res => {
            console.log(res)
            url = res.url
            asset = res.asset
            id = asset.id
            playbackId = asset.playbackId

            debugger;
            try {
                const axiosResult = await axios.put(url, videofile, {
                    headers: { "contentType": videofile.type }
                });
            } catch (e) {
                debugger;
                console.log(e);
            }
            console.dir(res)
            exportToIpfs(id).then(res => {

                //TODO Store result in DB
                const data = db.has(address) ? db.get(address) : [];

                data.push({
                    //ipfs_hash: ...
                    title: title,
                    token_gate_contracts: token_gate_contracts
                })

                db.set(address, data)
                db.sync()

                res.send(200, "TODO");
            })

        }
        )
    }
});


server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
