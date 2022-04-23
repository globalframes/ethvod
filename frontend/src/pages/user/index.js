import React, { useEffect, useState } from 'react';

import Player from "./components/Player";

function Comp() {
    const VIEWSTATES = {
        overview: 1,
    };

    const [viewstate, setViewstate] = React.useState(VIEWSTATES.overview);

    switch (viewstate) {
        case VIEWSTATES.overview:
            return (
                <>
                    <Player />
                </>
            );


    }

}

export default Comp;
