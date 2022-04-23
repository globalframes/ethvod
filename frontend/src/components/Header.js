import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import useWeb3Modal from '../hooks/useWeb3Modal'

const Container = styled.div`
  transform: rotate(-0.5deg);
  width: 100vw;
  margin: 0 auto;
  height: 60px;
  background: #ffffff;
`

const Navbar = styled.div`
  transform: rotate(0.5deg) translateY(-10px);
  background: #ffffff;
  position: fixed;
  width: 100%;
  height: 50px;
  margin: 0 auto;
  z-index: 100;
  display: grid;

  transition: 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);

  &.HeaderScrolled {
    padding: 1rem 0;
    backdrop-filter: blur(20px);

    a {
      color: black;
    }
  }

  @media (max-width: 640px) {
    padding: 1rem 0;

    a:nth-child(5) {
    }

    h1 {
      font-size: 14px;
    }

    p {
      font-size: 14px;
    }
  }
`

const NavGroup = styled.div`
  width: 90%;
  margin: 1.5rem auto;
  text-align: center;
  display: grid;
  grid-template-columns: repeat(2, auto);
  align-items: center;
  justify-items: center;

  a {
    justify-self: start;
    color: black;
    font-family: 'Orelega One';
    font-size: 18px;
  }

  img {
    margin: auto;
  }

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
    justify-self: center;
    margin: 0;
  }

  .connect {
    color: blue;
    justify-self: end;
  }
`

let $logocolor = 'purple'

const Header = props => {
  // constructor (props) {
  //   super(props)
  //   this.handleScroll = this.handleScroll.bind(this)
  //   this.state = {
  //     hasScrolled: false
  //   }
  // }
  const [hasScrolled, setHasScrolled] = useState(false)

  const handleScroll = event => {
    const scrollTop = window.pageYOffset

    if (scrollTop > 50) {
      setHasScrolled(true)
      $logocolor = 'white'
    } else {
      setHasScrolled(true)
      $logocolor = 'purple'
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const [provider, loadWeb3Modal, logoutOfWeb3Modal] = useWeb3Modal()

  function DisconnectWalletButton ({ provider, logoutOfWeb3Modal }) {
    if (!provider) {
      return (
        <button
          // className="button is-success is-outlined is-medium"
          onClick={async () => {
            loadWeb3Modal()
          }}
        >
          Connect Wallet
        </button>
      )
    }
    return (
      <>
        <span className='connect'>
          <button
            // className="button is-success is-outlined is-medium"
            onClick={async () => {
              logoutOfWeb3Modal()
            }}
          >
            Disconnect
          </button>
          {provider.provider.selectedAddress}
        </span>
      </>
    )
  }

  return (
    <Container>
      <Navbar className={hasScrolled ? 'HeaderScrolled' : ''}>
        <NavGroup>
          <a href='/'>globalframes</a>
          {/* <a href='/' className='connect'>
              Connect
            </a> */}
          <DisconnectWalletButton
            className='connect'
            provider={provider}
            loadWeb3Modal={loadWeb3Modal}
            logoutOfWeb3Modal={logoutOfWeb3Modal}
          />
        </NavGroup>
      </Navbar>
    </Container>
  )
}

export default Header
