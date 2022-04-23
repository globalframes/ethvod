import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

const DAO_STREAM_RECEIVER = "0xd8759be1bdf069831883ba597e296cf908b2df84"

function Comp({ onLoggedin }) {

    const [ready, setReady] = useState(false);
    const [paymentStreamFlowRate, setPaymentStreamFlowRate] = useState();


    const getPaymentStreamFlowRate = async () => {
        const res = await axios.post(
            "https://api.thegraph.com/subgraphs/name/superfluid-finance/protocol-v1-goerli", {
            query: `
            {
                flowUpdatedEvents(
                  where: {receiver: "${DAO_STREAM_RECEIVER}"}
                ) {
                  id
                  sender
                  receiver
                  timestamp
                  token
                  flowRate
                  blockNumber
                  totalAmountStreamedUntilTimestamp
                }
              }
            `
        }
        );

        if (res.data && res.data && res.data.data.flowUpdatedEvents && res.data.data.flowUpdatedEvents.length > 0) {

            // check if this payment is from the user, active and to our recepient address
            const lastPaymentStreamFlowRateEvent = res.data.data.flowUpdatedEvents.sort((a, b) => {
                return b.timestamp - a.timestamp
            })[0];


            if (lastPaymentStreamFlowRateEvent) {
                console.log("stream found");
                setPaymentStreamFlowRate(parseInt(lastPaymentStreamFlowRateEvent.flowRate));
                setReady(true);
                return;
            } else {
                console.log("No stream found");
                setPaymentStreamFlowRate(0);
                setReady(true);
                return;
            }
        }

        // if all else fails
        setPaymentStreamFlowRate(0);
        setReady(true);

    }


    useEffect(() => {
        getPaymentStreamFlowRate();
    }, []);


    if (!ready) {
        return (
            <h2 className="subtitle  has-text-white is-4">
                checking payment stream
            </h2>
        );
    }

    if (ready && !paymentStreamFlowRate && paymentStreamFlowRate === 0) {
        return (
            <h2 className="subtitle  has-text-white is-4">
                You need to create a payment stream to use the service
                {typeof paymentStreamFlowRate} {paymentStreamFlowRate}
            </h2>
        );
    }




    return (

        <h2 className="subtitle  has-text-white is-4">
            stream OK<br />
            Flowrate {paymentStreamFlowRate}
        </h2>

    );
}

export default Comp;
