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
    // TODO superfluid : check server side

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
            headers: { "Content-Type": 'video/mp4' },
            'maxContentLength': Infinity,
            'maxBodyLength': Infinity
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

server.get("/streams", async (req, res, next) => {

    const api = "https://livepeer.com/api/stream?streamsonly=1"
    const streamsResult = await axios.get(api
        , {
            headers: {
                "Authorization": `Bearer ${API_TOKEN}`,
                // "Content-Type": "application/json"
            }
        });

    const streams = streamsResult.data ? await Promise.all(streamsResult.data.map(async (stream) => {

        // console.log("STREAM",stream)

        // const streamDetail = await axios.get(
        //     `https://livepeer.com/api/stream/${stream.id}`
        //     , {
        //         headers: {
        //             "Authorization": `Bearer ${API_TOKEN}`,
        //         }
        //     });


        // console.log("STREAMDETAIL",streamDetail);

        return {
            playbackURL: `https://livepeercdn.com/hls/${stream.playbackId}/index.m3u8`
        };

    })) : [];

    console.log(streams);

    res.send(200, streams);
});

server.post("/stream", async (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        var { address, /*signature,*/ title, description } = req.body;
        const streamConfig = {
            "name": title,
            "profiles": [
                {
                    "name": "720p",
                    "bitrate": 2000000,
                    "fps": 30,
                    "width": 1280,
                    "height": 720
                },
                {
                    "name": "480p",
                    "bitrate": 1000000,
                    "fps": 30,
                    "width": 854,
                    "height": 480
                },
                {
                    "name": "360p",
                    "bitrate": 500000,
                    "fps": 30,
                    "width": 640,
                    "height": 360
                }
            ]
        }
        debugger;

        const api = 'https://livepeer.com/api/stream'
        try {
            const res = await axios.post(api, streamConfig

                , {
                    headers: {
                        "Authorization": `Bearer ${API_TOKEN}`,
                        "Content-Type": "application/json"
                    }
                });
            console.log(res)
            return res.data;
        } catch (e) {
            console.log(e)
            return {};
        }
    }

});

server.post("/upload", (req, res, next) => {
    if (!req.body) {
        res.send(400, "not enough parameters");
        return next();
    } else {
        const { address, /*signature,*/ title, token_contract, description } = req.body;
        const videofile = req.files.videoFile
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
                        id: id,
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
    if (!data) {
        console.log(`ERROR: no videos found for ${address}`)
        return (res.send(200, []));
    }
    const result = await Promise.all(data.map(async (row) => {
        const info = await getAssetInfo(row.id)
        return {
            id: row.id,
            title: row.title,
            description: row.description,
            downloadUrl: info.downloadUrl,
            playbackId: info.playbackId,
            token_contract: row.token_contract
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
