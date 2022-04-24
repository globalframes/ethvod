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
import ERC721ABI from "../../../assets/ERC721-ABI.json";
import { Contract } from 'ethers';


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
    const [showUploadButtons, setShowUploadButtons] = useState()

    const location = useLocation();

    React.useEffect(() => {
        if (!provider || !provider.provider) return
        setCurrentAccount(provider.provider.selectedAddress)
        getVideoList(provider.provider.selectedAddress)
        provider.provider.on('accountsChanged', accounts => {
            setCurrentAccount(provider.provider.selectedAddress)
            getVideoList(provider.provider.selectedAddress)
        })
    }, [provider])


    React.useEffect(() => {
        getVideoList()
    },[]);

    const getBalance = async (tokenAddress) => {
        if (!provider || !provider.provider || !provider.provider.selectedAddress){
            return 0;
        }
        const contract = new Contract(tokenAddress, ERC721ABI, provider);
        try {
            const balance = await contract.balanceOf(provider.provider.selectedAddress);
            return balance.toString();
        } catch (e) {
            debugger;
            console.log(e)
        }
    };


    React.useEffect(() => {
        setShowUploadButtons(location.pathname == "/creator")
    }, [location])


    const getVideoList = async account => {
        console.log('get video list', account)
        const channel = "0xd8759be1bdf069831883ba597e296cf908b2df84"
        axios.get(`http://localhost:9999/list/${channel}`).then(async res => {
            console.log(res.data)

            const vids = await Promise.all(res.data.map(async (v) => {
                let b = 0;
                if (v.token_contract) {
                    console.log("This video is tokengated by", v.token_contract);
                    b = await getBalance(v.token_contract);
                    console.log("balance=", b);
                }
// debugger;
                return {...v,locked: b === 0};
            }))


            setVideoList(vids)
        })

        axios.get(`http://localhost:9999/streams`).then(res => {
            setStreamList(res.data)
        })
    }

    const LockedVid = ({ video }) => {
      

        return (
            <VideoContainer>
                <Title>{video.title}</Title>
                <Description>This video is only available to LPT token holders. Please connect your wallet to unlock this content.</Description>
                <VideoJS />
            </VideoContainer>
        )
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
            // debugger;
            if (video.locked){
                return <LockedVid key={`vid_${i}`} video={video}/>
            }
            if (i === 0) {
                return <BigVid key={`vid_${i}`} video={video} tokengateaddress={video.token_contract} />
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

        return (
            <Container>
                {showUploadButtons && (
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
