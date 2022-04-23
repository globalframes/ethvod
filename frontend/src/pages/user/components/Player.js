import React, { useEffect, useState } from 'react'
// import "./css/style.sass";
import axios from 'axios'
import 'react-drop-zone/dist/styles.css'
import styled from 'styled-components'
// import VideoPlayer from 'react-video-js-player';
import VideoJS from './VideoJS'

const Container = styled.div`
  display: grid;
`

const VideoContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: repeat(2, 1fr);
`

const Title = styled.h1`
  font-size: 26px;
  text-align: left;
`
const Description = styled.h2`
  font-size: 18px;
  text-align: left;
`

function Comp ({}) {
  const [ready, setReady] = useState(false)
  const [videoList, setVideoList] = useState()
  const [streamList, setStreamList] = useState()

  const getAddress = async () => {
    try {
      const { ethereum } = window

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }

      /*
       * Check if we're authorized to access the user's wallet
       */
      const accounts = await ethereum.request({ method: 'eth_accounts' })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        // setCurrentAccount(account);
        getVideoList(account)
        setReady(true)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const loadData = async () => {
    await getAddress()
    // await getVideoList();
  }

  useEffect(() => {
    loadData()
  }, [])

  const getVideoList = async account => {
    // debugger;
    axios.get(`http://localhost:9999/list/${account}`).then(res => {
      setVideoList(res.data)
    })

    axios.get(`http://localhost:9999/streams`).then(res => {
      setStreamList(res.data)
    })

    // setVideoList([])
  }

  if (!ready) {
    return <h2 className='subtitle  has-text-white is-4'>loading video's</h2>
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
        <VideoJS options={videoJsOptions} />
        <div>
          <Title>{video.title}</Title>
          <Description>{video.description}</Description>
        </div>
      </VideoContainer>
    )
  }
  const SmallVid = video => {
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
      sources: [
        {
          src: stream.playbackURL
          // type: 'video/mp4'
        }
      ]
    }

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

  return <h2 className='subtitle  has-text-white is-4'></h2>
}

export default Comp
