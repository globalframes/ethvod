import React, { useEffect, useState } from 'react';
import Payment from "./components/Payment";


function Login() {
    const VIEWSTATES = {
        paymentform: 1,
    };

    const [viewstate, setViewstate] = React.useState(VIEWSTATES.paymentform);



    switch (viewstate) {
        case VIEWSTATES.paymentform:
            return (<Payment onLoggedin={() => {
                // setViewstate(VIEWSTATES.payment);
            }} />);

    }

}

export default Login;
