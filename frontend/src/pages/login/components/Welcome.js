import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

function Login({ onLoggedin }) {
    const [currentAccount, setCurrentAccount] = useState("");

    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = data => console.log(data);

    const checkIfWalletIsConnected = async () => {
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
            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                alert("Get MetaMask!");
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });

            console.log("Connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };


    const handleSignMessage = async ({ publicAddress, nonce }) => {

        try {


            const { ethereum } = window;
            const chainId = await ethereum.request({ method: 'eth_chainId' });

            const domain = [
                { name: "name", type: "string" },
                { name: "version", type: "string" },
                { name: "chainId", type: "uint256" },
                { name: "verifyingContract", type: "address" },
                { name: "salt", type: "bytes32" },
            ];
            const bid = [
                { name: "loginaddress", type: "address" },
                // { name: "bidder", type: "Identity" },
            ];
            // const identity = [
            //     { name: "userId", type: "uint256" },
            //     { name: "wallet", type: "address" },
            // ];

            const domainData = {
                name: "GlobalFrames Sign In",
                version: "2",
                chainId: parseInt(chainId, 10),
                verifyingContract: "0x1C56346CD2A2Bf3202F771f50d3D14a367B48070",
                salt: "0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558"
            };
            var message = {
                loginaddress: currentAccount,
                // bidder: {
                //     userId: 323,
                //     wallet: "0x3333333333333333333333333333333333333333"
                // }
            };
            
            const data = JSON.stringify({
                types: {
                    EIP712Domain: domain,
                    Bid: bid,
                    // Identity: identity,
                },
                domain: domainData,
                primaryType: "Bid",
                message: message
            });

            const response = await ethereum.request({

                method: "eth_signTypedData_v3",
                params: [currentAccount, data],
                from: currentAccount
            });
            console.log(response);


            // const response = await ethereum.request({
            //     method: 'personal_sign',
            //     params: [
            //         `0x${new Buffer(nonce).toString("hex")}`,
            //         publicAddress,
            //     ],
            // });
            // console.log(response);

        }
        catch (e) {
            console.log(e);
        }

    };

    const login = () => {
        handleSignMessage({ publicAddress: currentAccount, nonce: "QUAAK" }).then(() => {
            onLoggedin(currentAccount)
        })
    }

    useEffect(() => {
        checkIfWalletIsConnected();
    }, []);

    return (
        <div className="App">
            <section className="hero is-default is-bold">
                <div className="hero-body">
                    <div className="container has-text-centered ">
                        <div className="columns is-vcentered">
                            <div className="column  is-6 is-offset-1">
                                <h1 className="title has-text-white is-2">
                                    Welcome to GlobalFrames
                                </h1>
                                <br />
                                <h2 className="subtitle  has-text-white is-4">
                                    Please authenticate by connecting your wallet
                                </h2>

                                <br />

                                {!currentAccount && (
                                    <p className="has-text-centered">
                                        <button className="button is-medium is-link" onClick={connectWallet}>
                                            connect
                                        </button>
                                    </p>
                                )}

                                {currentAccount}

                                {currentAccount && login() && (

                                    < div > Logging in....</div>

                                )}


                            </div>

                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}

export default Login;
