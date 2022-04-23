import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
// import VideoPlayer from 'react-video-js-player';
import VideoJS from './VideoJS'
import useWeb3Modal from "../../../hooks/useWeb3Modal";


function Comp({ }) {
    const [provider] = useWeb3Modal();
    const [videoList, setVideoList] = useState();
    const [streamList, setStreamList] = useState();
    const [currentAccount, setCurrentAccount] = useState();

    React.useEffect(() => {
        if (!provider || !provider.provider) return;
        setCurrentAccount(provider.provider.selectedAddress);
        getVideoList(provider.provider.selectedAddress);
        provider.provider.on("accountsChanged", (accounts) => {
            setCurrentAccount(provider.provider.selectedAddress);
            getVideoList(provider.provider.selectedAddress);
        });
    }, [provider]);


    const getVideoList = async (account) => {
        console.log("get video list", account);
        axios.get(`http://localhost:9999/list/${account}`).then((res) => {
            console.log(res.data)
            setVideoList(res.data);
        });

        axios.get(`http://localhost:9999/streams`).then((res) => {
            setStreamList(res.data);
        });
    }

    const BigVid = ({ video }) => {

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
    const SmallVid = ({ video }) => {

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
                <h4>Small video</h4>
                <div>Title: {video.title}</div>
                <div>Description: {video.description}</div>
                <VideoJS options={videoJsOptions} />
            </>
        )
    }


    const BigStream = ({ stream }) => {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [{
                src: stream.playbackURL,
                // type: 'video/mp4'
            }]
        };

        return (
            <>
                <h1>Stream</h1>
                <div>Title: {stream.title}</div>
                <VideoJS options={videoJsOptions} />
            </>
        )
    }


    if (videoList && streamList) {

        const vids = videoList.map((video, i) => {
            if (i === 0) {
                return (<BigVid key={`vid_${i}`} video={video} />)
            } else {
                return (<SmallVid key={`vid_${i}`} video={video} />)
            }
        })

        const streams = streamList ? streamList.map((stream, i) => {
            // if (i === 0) {
            return (<BigStream key={`stream_${i}`} stream={stream} />)
            // } else {
            //     return (<SmallStream key={`vid_${i}`} video={video} />)
            // }
        }) : [];

        return (<>
            <h1>Giveth Video's</h1>
            <div>{vids}</div>
            <h1>Giveth Streams</h1>
            <div>{streams}</div>
        </>)


        // return (



        //     // <>
        //     //     <VideoJS options={videoJsOptions} />
        //     // </>



        // );
    } else {
        return (
            <h2 className="subtitle  has-text-white is-4">
                loading video's
            </h2>
        );
    }
}

export default Comp;
