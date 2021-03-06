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
  const [description, setDescription] = useState();

  const createStream = () => {

    // // Create an object of formData
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);

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
        <div className="field">
          <label className="label">Description</label>
          <div className="control">
            <textarea className="textarea" placeholder="Stream description" onChange={(e) => { setDescription(e.target.value) }}></textarea>                    </div>
        </div>


        <div>
          <button
            className={'button is-medium'}
            disabled={!title || !description}
            onClick={e => createStream()}
          >Start streaming!</button>
        </div>

      </div>




    </>
  );

}

export default Comp;
