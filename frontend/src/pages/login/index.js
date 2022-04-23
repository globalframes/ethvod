import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { StyledDropZone } from 'react-drop-zone'
// import 'react-drop-zone/dist/styles.css'

import Welcome from "./components/Welcome";
import {
    Navigate,
} from "react-router-dom";

function Login() {
    const VIEWSTATES = {
        welcome: 1,
        payment: 2,
    };

    const [viewstate, setViewstate] = React.useState(VIEWSTATES.payment);



    switch (viewstate) {
        case VIEWSTATES.welcome:
            return (<Welcome onLoggedin={ () => {
                setViewstate(VIEWSTATES.payment);
            }} />);
        case VIEWSTATES.payment:
            return (<Navigate to="/payment" replace />);
    }

}

export default Login;
