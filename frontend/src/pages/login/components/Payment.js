import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

const DAO_STREAM_RECEIVER = "0x7168857E350f3833a76d6943857AB00D901D2912"

function Comp({ onLoggedin }) {

    const [ready, setReady] = useState(false);
    const [paymentStream, setPaymentStream] = useState();


    const getPaymentStream = async () => {
        const res = await axios.post(
            "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli", {
            query: `
            {
                flowUpdatedEvents(
                  where: {receiver: "0xd8759be1bdf069831883ba597e296cf908b2df84"}
                ) {
                  id
                  sender
                  receiver
                  timestamp
                  token
                  totalAmountStreamedUntilTimestamp
                }
              }
            `
        }
        );
        // debugger;


        if (res.data.flowUpdatedEvents && res.data.flowUpdatedEvents.length > 0) {

            // check if this payment is from the user, active and to our recepient address
            const paymentStream = res.data.flowUpdatedEvents.find((item) => {

                return item.receiver === DAO_STREAM_RECEIVER;

            })
            debugger;

            setPaymentStream(paymentStream);
            setReady(true);

            return paymentStream;


        }


        // console.log(res.data)

    }


    useEffect(() => {
        getPaymentStream();
    }, []);


    if (!ready) {
        return (
            <h2 className="subtitle  has-text-white is-4">
                checking payment stream
            </h2>
        );
    }

    if (ready && !paymentStream){
        return (
            <h2 className="subtitle  has-text-white is-4">
                You need to create a payment stream to use the service
            </h2>
        );
    }



    
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
                                    checking payment stream
                                </h2>

                                <br />

                            </div>

                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
}

export default Comp;
