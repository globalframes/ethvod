import React, { useEffect, useState } from 'react';
// import "./css/style.sass";
import axios from "axios";
import { useForm } from "react-hook-form";
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

function Comp({ onLoggedin }) {

    const [ready, setReady] = useState(false);
    // On file select (from the pop up)
    const [file, setFile] = useState();
    const [title, setTitle] = useState();


    const createStream = () => {
        if (!file) return;


        // // Create an object of formData
        // const formData = new FormData();

        // // Update the formData object
        // formData.append(
        //     "videoFile",
        //     file,
        //     file.name
        // );

        // // Details of the uploaded file
        // console.log(file);

        // Request made to the backend api
        // Send formData object
        axios.post("http://localhost:9999/stream", formData);

    }

    return (
        <>
            <h2 className="subtitle  has-text-white is-4">
                Start streaming
            </h2>
            <div>
                <div className="field">
                    <label className="label">Stream Title</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Stream title" name="Title" onChange={(e) => { setTitle(e.target.value); }} />
                    </div>
                </div>


                <div>
                    <button className="button is-medium is-link" onClick={(e) => { createStream() }}>
                        Start streaming!
                    </button>
                </div>

            </div>




        </>
    );

}

export default Comp;
