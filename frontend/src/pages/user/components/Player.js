import React, { useEffect, useState } from 'react'
// import "./css/style.sass";
import axios from 'axios'
import 'react-drop-zone/dist/styles.css'
import styled from 'styled-components'
// import VideoPlayer from 'react-video-js-player';
import VideoJS from './VideoJS'
import useWeb3Modal from "../../../hooks/useWeb3Modal";

const Container = styled.div`
  display: grid;
`

const VideoContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
`
function Comp({ }) {
    const [provider] = useWeb3Modal();
    const [videoList, setVideoList] = useState();
    const [streamList, setStreamList] = useState();
    const [currentAccount, setCurrentAccount] = useState();

const Title = styled.h1`
  font-size: 26px;
  text-align: left;
`
const Description = styled.h2`
  font-size: 18px;
  text-align: left;
`
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

    return (
      <>
        <h1>Stream</h1>
        <h2>{stream.title}</h2>
        <VideoJS options={videoJsOptions} />
      </>
    )
  }

  if (ready && videoList && streamList) {
    const vids = videoList.map((video, i) => {
      if (i === 0) {
        return <BigVid key={`vid_${i}`} video={video} />
      } else {
        return <SmallVid key={`vid_${i}`} video={video} />
      }
    })


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
      : []

    return (
      <Container>
        <h1>Your Videos</h1>
        <VideoContainer>{vids}</VideoContainer>
        <h1>Your Streams</h1>
        <VideoContainer>{streams}</VideoContainer>
      </Container>
    )

    // return (

    //     // <>
    //     //     <VideoJS options={videoJsOptions} />
    //     // </>

    // );
  }



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

export default Comp
