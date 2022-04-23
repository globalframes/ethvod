import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
// import axios from "axios";
// import { useForm } from "react-hook-form";
// import { StyledDropZone } from 'react-drop-zone'
// import 'react-drop-zone/dist/styles.css'

import Upload from "./components/Upload";


function Comp() {
    const VIEWSTATES = {
        showform: 1,
        
    };

    const [viewstate, setViewstate] = React.useState(VIEWSTATES.showform);



    switch (viewstate) {
        case VIEWSTATES.showform:
            return (<Upload onLoggedin={ () => {
                // setViewstate(VIEWSTATES);
            }} />);
        

    }

}

export default Comp;
