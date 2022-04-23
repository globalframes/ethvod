import React, { useEffect, useState } from 'react'
// import "./css/style.sass";
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'
import useWeb3Modal from '../../../hooks/useWeb3Modal'

function Login ({ onLoggedin }) {
  const [currentAccount, setCurrentAccount] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm()

  const [provider] = useWeb3Modal()

  const handleSignMessage = async ({ publicAddress, nonce }) => {
    try {
      const { ethereum } = window
      const chainId = await ethereum.request({ method: 'eth_chainId' })

      const domain = [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
        { name: 'salt', type: 'bytes32' }
      ]
      const bid = [{ name: 'loginaddress', type: 'address' }]

      const domainData = {
        name: 'GlobalFrames Sign In',
        version: '2',
        chainId: parseInt(chainId, 10),
        verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
        salt:
          '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558'
      }
      var message = {
        loginaddress: publicAddress
      }

      const data = JSON.stringify({
        types: {
          EIP712Domain: domain,
          Bid: bid
          // Identity: identity,
        },
        domain: domainData,
        primaryType: 'Bid',
        message: message
      })

      const response = await ethereum.request({
        method: 'eth_signTypedData_v3',
        params: [publicAddress, data],
        from: publicAddress
      })
      console.log(response)
    } catch (e) {
      console.log(e)
      throw new Error(e)
    }
  }

  const login = publicAddress => {
    handleSignMessage({
      publicAddress,
      nonce: Math.floor(Math.random() * 100000 + 10000)
    }).then(() => {
      onLoggedin(currentAccount)
    })
  }

  React.useEffect(() => {
    if (!provider || !provider.provider) return
    setCurrentAccount(provider.provider.selectedAddress)
    // onLoggedin()
    debugger
    if (provider.provider.selectedAddress) {
      login(provider.provider.selectedAddress)
    }
    provider.provider.on('accountsChanged', accounts => {
      setCurrentAccount(provider.provider.selectedAddress)
      login(provider.provider.selectedAddress)
      // login();
    })
  }, [provider])

  return (
    <div className='App'>
      <section className='hero is-default is-bold'>
        <div className='hero-body'>
          <div className='container has-text-centered '>
            <div className='columns is-vcentered'>
              <div className='column  is-6 is-offset-1'>
                <h1 className='title has-text-white is-2'>
                  Welcome to GlobalFrames
                </h1>
                <br />
                <h2 className='subtitle  has-text-white is-4'>
                  Please authenticate by connecting your wallet
                </h2>

                <br />

                {!currentAccount && (
                  <p className='has-text-centered'>
                    Please connect to your wallet to sign in
                    {/* <button className="button is-medium is-link" onClick={connectWallet}>
                                            connect
                                        </button> */}
                  </p>
                )}
                {/* 
                                {currentAccount && (
                                    <p className="has-text-centered">
                                        Please sign in
                                        <button className="button is-medium is-link" onClick={login}>
                                            Sign In
                                        </button>
                                    </p>
                                )} */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Login
