const restify = require("restify");
const corsMiddleware = require("restify-cors-middleware2");
const jsonfile = require('jsonfile')
const Accounts = require('web3-eth-accounts');
const FormData = require('form-data')
const accounts = new Accounts();
const fs = require('fs');
const axios = require('axios');
require('dotenv').config()
const exec = require("child_process").exec;

const API_TOKEN = process.env.API_TOKEN;

const JSONdb = require('simple-json-db');
const db = new JSONdb('/tmp/storage.json');

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

const uploadVideo = async (url, video) => {
    try {
        const res = await axios.put(url, fs.createReadStream(video.path), {
            headers: { "Content-Type" : 'video/mp4'}
        });
        return res.data;
    } catch (e) {
        console.log("Error uploading video", e)
        return {};
    }
}

const exportToIpfs = async (asset_id) => {
    try {
        const url = `https://livepeer.com/api/asset/${asset_id}/export`
        const res = await axios.post(url, { ipfs: {} }, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                "Content-Type": "application/json"
            }
        });
        // console.log(res)
        return res.data;
    } catch (e) {
        console.log("Error exporting to IPFS", e)
        return {};
    }
}


const getAssetInfo = async (asset_id) => {
    try {
        const url = `https://livepeer.com/api/asset/${asset_id}`
        const res = await axios.get(url, {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`
            }
        });
        // console.log(res.data)
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
        var { address, /*signature,*/ title , token_contract, description } = req.body;
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

        console.log("Starting upload")

        // Upload video to LivePeer
        createUploadUrl(title).then(res => {
            console.log("Upload url:", res.url)
            url = res.url
            asset = res.asset
            id = asset.id
            playbackId = asset.playbackId

            uploadVideo(url, videofile).then(res => {
                console.log("Uploaded video")

                exportToIpfs(id).then(res => {
                    console.log("Exported video to ipfs")
                    const data = db.has(address) ? db.get(address) : [];
                    const newRow = {
                        id : id,
                        title: title,
                        description: description,
                        token_contract: token_contract
                    }
                    data.push(newRow)

                    console.log("Stored", newRow)

                    db.set(address, data)
                    db.sync()

                })
            })
        }
        )
        res.send(200, "TODO");
    }
});

server.get("/list/:address", async (req, res) => {
    const address = req.params.address
    const data = db.get(address)

    const result = await Promise.all(data.map(async (row) => {
        const info = await getAssetInfo(row.id)
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            downloadUrl: info.downloadUrl,
            playbackId: info.playbackId,
            token_contract: token_contract
        }
    }))
    res.send(200, result);
});

server.get("/thumnail/:id", async (req, res) => {
    const id = req.params.id
    const thumbNailPath = `/tmp/${id}.png`
    if (!fs.existsSync(thumbNailPath)) {
        const info = await getAssetInfo(id)
        const url = info.downloadUrl
        //TODO:smaller size : https://superuser.com/questions/602315/ffmpeg-thumbnails-with-exact-size-main-aspect-ratio
        const cmd = `ffmpeg -i ${url} -ss 00:00:01.000 -vframes 1 ${thumbNailPath}`
        console.log(cmd)
        await exec(cmd, (error, stdout, stderr) => {
            console.log(error)
            console.log(stdout)
            console.log(stderr)
        })
    }
    
    fs.readFile(thumbNailPath, function (err, data) {
        if (err) {
            next(err);
            return;
        }
        res.setHeader('Content-Type', 'image/png');
        res.writeHead(200);
        res.end(data);
        next();
    });
});

server.listen(9999, function () {
    console.log("%s listening at %s", server.name, server.url);
});
