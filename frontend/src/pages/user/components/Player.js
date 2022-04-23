import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
// import VideoPlayer from 'react-video-js-player';
import VideoJS from './VideoJS'

function Comp({ }) {

    const [ready, setReady] = useState(false);
    const [videoList, setVideoList] = useState();

    const [description, setDescription] = useState();
    const [currentAccount, setCurrentAccount] = useState();


    const getAddress = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                console.log("Make sure you have metamask!");
                return;
            } else {
                console.log("We have the ethereum object", ethereum);
            }

            /*
            * Check if we're authorized to access the user's wallet
            */
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                console.log("Found an authorized account:", account);
                setCurrentAccount(account);
                getVideoList(account);
                setReady(true);

            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadData = async () => {
        await getAddress();
        // await getVideoList();
    }


    useEffect(() => {
        loadData();
    }, []);


    const getVideoList = async (account) => {
        const res = await axios.get(`http://localhost:9999/list/${account}`);

        setVideoList(res.data);
        // setVideoList([])
    }



    if (!ready) {
        return (
            <h2 className="subtitle  has-text-white is-4">
                loading video's
            </h2>
        );
    }



    const BigVid = ({video}) => {

        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: video.downloadUrl,
                type: 'video/mp4'
            }]
        };

        return (
            <>
                <h1>Big video</h1>
                <div>Title: {video.title}</div>
                <div>Description: {video.description}</div>
                <VideoJS options={videoJsOptions} />
            </>
        )
    }
    const SmallVid = (video) => {

        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: video.downloadUrl,
                type: 'video/mp4'
            }]
        };
        debugger;
        return (
            <>
                <h4>Small video</h4>
                <div>Title: {video.title}</div>
                <div>Description: {video.description}</div>
                <VideoJS options={videoJsOptions} />
            </>
        )
    }


    if (ready && videoList) {

        const vids = videoList.map((video, i) => {
            if (i === 0) {
                return (<BigVid key={`vid_${i}`} video={video} />)
            } else {
                return (<SmallVid key={`vid_${i}`} video={video} />)
            }

        })


        return (<>
            <h1>Giveth Video's</h1>
            <div>{vids}</div>
        </>)


        // return (



        //     // <>
        //     //     <VideoJS options={videoJsOptions} />
        //     // </>



        // );
    }




    return (

        <h2 className="subtitle  has-text-white is-4">
        </h2>

    );
}

export default Comp;
