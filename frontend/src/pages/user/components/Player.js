import React, { useEffect, useState } from 'react'
// import "./css/style.sass";
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
import styled from 'styled-components'
import VideoJS from './VideoJS'
import useWeb3Modal from '../../../hooks/useWeb3Modal'
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom'


const Container = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 3rem;
`

const VideoContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
`
const Title = styled.h1`
  font-size: 26px;
  text-align: left;
  grid-column: 2;
  grid-row: 1;
`
const Description = styled.h2`
  font-size: 18px;
  text-align: left;
  grid-column: 2;
  grid-row: 1;
  padding-top: 3rem;
`

function Comp({ }) {
    const [provider] = useWeb3Modal()
    const [videoList, setVideoList] = useState()
    const [streamList, setStreamList] = useState()
    const [currentAccount, setCurrentAccount] = useState()

    React.useEffect(() => {
        if (!provider || !provider.provider) return
        setCurrentAccount(provider.provider.selectedAddress)
        getVideoList(provider.provider.selectedAddress)
        provider.provider.on('accountsChanged', accounts => {
            setCurrentAccount(provider.provider.selectedAddress)
            getVideoList(provider.provider.selectedAddress)
        })
    }, [provider])

    const getVideoList = async account => {
        console.log('get video list', account)
        axios.get(`http://localhost:9999/list/${account}`).then(res => {
            console.log(res.data)
            setVideoList(res.data)
        })

        axios.get(`http://localhost:9999/streams`).then(res => {
            setStreamList(res.data)
        })
    }

    const BigVid = ({ video }) => {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
                {
                    src: video.downloadUrl,
                    type: 'video/mp4'
                }
            ]
        }

        return (
            <VideoContainer>
                <Title>{video.title}</Title>
                <Description>{video.description}</Description>
                <VideoJS options={videoJsOptions} />
            </VideoContainer>
        )
    }
    const SmallVid = ({ video }) => {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
                {
                    src: video.downloadUrl,
                    type: 'video/mp4'
                }
            ]
        }

        return (
            <VideoContainer>
                <Title>{video.title}</Title>
                <Description>{video.description}</Description>
                <VideoJS options={videoJsOptions} />
            </VideoContainer>
        )
    }

    const BigStream = ({ stream }) => {
        const videoJsOptions = {
            autoplay: false,
            controls: true,
            responsive: true,
            fluid: true,
            sources: [
                {
                    src: stream.playbackURL
                    // type: 'video/mp4'
                }
            ]
        }

        return (
            <VideoContainer>
                <Title>{stream.title}</Title>
                <VideoJS options={videoJsOptions} />
            </VideoContainer>
        )
    }

    if (videoList && streamList) {
        const vids = videoList.map((video, i) => {
            if (i === 0) {
                return <BigVid key={`vid_${i}`} video={video} />
            } else {
                return <SmallVid key={`vid_${i}`} video={video} />
            }
        })

        const streams = streamList
            ? streamList.map((stream, i) => {
                // if (i === 0) {
                return <BigStream key={`stream_${i}`} stream={stream} />
                // } else {
                //     return (<SmallStream key={`vid_${i}`} video={video} />)
                // }
            })
            : []

        const location = useLocation();

        return (
            <Container>
                {location.pathname == "/creator" && (
                    <>
                        <Link to="/upload">
                            <button className="button is-medium">
                                Upload a video
                            </button>
                        </Link>
                        <Link to="/upload">
                            <button className="button is-medium">
                                Set up a stream
                            </button>
                        </Link>
                    </>
                )}
                <h1>Your Videos</h1>
                <div>{vids}</div>
                <h1>Your Streams</h1>
                <div>{streams}</div>
            </Container>
        )

        // return (

        //     // <>
        //     //     <VideoJS options={videoJsOptions} />
        //     // </>

        // );
    } else {
        return <h2 className='subtitle  has-text-white is-4'>loading videos</h2>
    }
}

export default Comp
