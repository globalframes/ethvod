import React, { useEffect, useState } from 'react';

import Upload from "./components/Upload";
import Stream from "./components/Stream";


function Comp() {
    const VIEWSTATES = {
        overview: 1,  
    };

    const [viewstate, setViewstate] = React.useState(VIEWSTATES.overview);

    switch (viewstate) {
        case VIEWSTATES.showform:
            return (
            <>
                        <Upload onUploaded={ () => {
                // setViewstate(VIEWSTATES);
            }} />
                        <Stream onStreaming={ () => {
                // setViewstate(VIEWSTATES);
            }} />
            </>
);
        

    }

}

export default Comp;
