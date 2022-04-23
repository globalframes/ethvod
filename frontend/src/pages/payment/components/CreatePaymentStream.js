import React, { useState, useEffect } from "react";
// import { customHttpProvider } from "./config";
import { Framework } from "@superfluid-finance/sdk-core";
import { Button, Form, FormGroup, FormControl, Spinner } from "react-bootstrap";
// import "./createFlow.css";
import { ethers } from "ethers";
import useWeb3Modal from "../../../hooks/useWeb3Modal";
const DAO_STREAM_RECEIVER = "0xd8759be1bdf069831883ba597e296cf908b2df84"


const Comp = () => {


    const [provider] = useWeb3Modal();


    const [recipient, setRecipient] = useState("");
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [flowRate, setFlowRate] = useState((3 * 10e4).toString());
    const [flowRateDisplay, setFlowRateDisplay] = useState("");
    const [currentAccount, setCurrentAccount] = useState();

    //where the Superfluid logic takes place
    async function createNewFlow(recipient, flowRate) {
        // const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner()

        const sf = await Framework.create({
            networkName: "goerli",
            provider
        });

        const ETHxContract = await sf.loadSuperToken("ETHx");
        const ETHx = ETHxContract.address;

        try {
            const createFlowOperation = sf.cfaV1.createFlow({
                flowRate: flowRate,
                receiver: recipient,
                superToken: ETHx
                // userData?: string
            });

            console.log("Creating your stream...");

            const result = await createFlowOperation.exec(signer);
            console.log(result);

            console.log(
                `Congrats - you've just created a money stream!
    View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    Network: Kovan
    Super Token: DAIx
    Sender: 0xDCB45e4f6762C3D7C61a00e96Fb94ADb7Cf27721
    Receiver: ${recipient},
    FlowRate: ${flowRate}
    `
            );
        } catch (error) {
            console.log(
                "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
            );
            console.error(error);
        }
    }


    React.useEffect(() => {
        if (!provider || !provider.provider) return;
        setCurrentAccount(provider.provider.selectedAddress);
        provider.provider.on("accountsChanged", (accounts) => {
            setCurrentAccount(provider.provider.selectedAddress);
        });
    }, [provider]);


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
                setRecipient(DAO_STREAM_RECEIVER);

            } else {
                console.log("No authorized account found");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const loadData = async () => {
        await getAddress();
    }

    useEffect(() => {
        loadData();
    }, []);


    function calculateFlowRate(amount) {
        if (typeof Number(amount) !== "number" || isNaN(Number(amount)) === true) {
            alert("You can only calculate a flowRate based on a number");
            return;
        } else if (typeof Number(amount) === "number") {
            if (Number(amount) === 0) {
                return 0;
            }
            const amountInWei = ethers.BigNumber.from(amount);
            const monthlyAmount = ethers.utils.formatEther(amountInWei.toString());
            const calculatedFlowRate = monthlyAmount * 3600 * 24 * 30;
            return calculatedFlowRate;
        }
    }

    // function CreateButton({ isLoading, children, ...props }) {
    //     return (
    //         <Button variant="success" className="button" {...props}>
    //             {isButtonLoading ? <Spinner animation="border" /> : children}
    //         </Button>
    //     );
    // }

    // const handleRecipientChange = (e) => {
    //     setRecipient(() => ([e.target.name] = e.target.value));
    // };

    // const handleFlowRateChange = (e) => {
    //     setFlowRate(() => ([e.target.name] = e.target.value));
    //     // if (typeof Number(flowRate) === "number") {
    //     let newFlowRateDisplay = calculateFlowRate(e.target.value);
    //     setFlowRateDisplay(newFlowRateDisplay.toString());
    //     // setFlowRateDisplay(() => calculateFlowRate(e.target.value));
    //     // }
    // };

    return (
        <div>
            <h2>Create a Flow</h2>
            <span>We will create a stream from {currentAccount} to {DAO_STREAM_RECEIVER}</span>
            <button className="button is-medium is-link" onClick={(e) => {
                console.log("quaak");
                createNewFlow(recipient, flowRate);
            }}>
                Subscribe</button>
        </div>
    );
};

export default Comp;
