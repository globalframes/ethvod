import React, { useEffect, useState } from 'react'
// import "./css/style.sass";
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { StyledDropZone } from 'react-drop-zone'
import 'react-drop-zone/dist/styles.css'

function Comp ({ onLoggedin }) {
  const [ready, setReady] = useState(false)
  // On file select (from the pop up)
  const [file, setFile] = useState()
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [currentAccount, setCurrentAccount] = useState()

    const [ready, setReady] = useState(false);
    // On file select (from the pop up)
    const [file, setFile] = useState();
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [currentAccount, setCurrentAccount] = useState();
    const [tokenContract, setTokenContract] = useState();

      if (!ethereum) {
        console.log('Make sure you have metamask!')
        return
      } else {
        console.log('We have the ethereum object', ethereum)
      }


    const getAddress = async () => {
        try {
            const { ethereum } = window;

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log('Found an authorized account:', account)
        setCurrentAccount(account)
      } else {
        console.log('No authorized account found')
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getAddress()
  }, [])

  const uploadFile = () => {
    if (!file) return

    // Create an object of formData
    const formData = new FormData()

    // Update the formData object
    formData.append('videoFile', file, file.name)
    formData.append('title', title)
    formData.append('description', description)
    formData.append('address', currentAccount)

    // Details of the uploaded file
    console.log(file)

        // Update the formData object
        formData.append(
            "videoFile",
            file,
            file.name
        );
        formData.append('title', title);
        formData.append('description', description);
        formData.append('address', currentAccount);
        formData.append('token_contract', tokenContract);

  return (
    <>
      <h2 className='subtitle  has-text-white is-4'>Upload a video</h2>
      <div>
        <div className='field'>
          <label className='label'>Title</label>
          <div className='control'>
            <input
              className='input'
              type='text'
              placeholder='Video title'
              name='Title'
              onChange={e => {
                setTitle(e.target.value)
              }}
            />
          </div>
        </div>
        <div className='field'>
          <label className='label'>Description</label>
          <div className='control'>
            <textarea
              className='textarea'
              placeholder='Video description'
              onChange={e => {
                setDescription(e.target.value)
              }}
            ></textarea>{' '}
          </div>
        </div>

        <div className='file has-name'>
          <label className='file-label'>
            <input
              className='file-input'
              type='file'
              onChange={e => {
                setFile(e.target.files[0])
              }}
            />

            <span className='file-cta'>
              <span className='file-icon'>
                <i className='fas fa-upload'></i>
              </span>
              <span className='file-label'>Choose a file…</span>
            </span>
            {file && <span className='file-name'>{file.name}</span>}
          </label>
        </div>

    return (
        <>
            <h2 className="subtitle  has-text-white is-4">
                Upload a video
            </h2>
            <div>
                <div className="field">
                    <label className="label">Title</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Video title" name="Title" onChange={(e) => { setTitle(e.target.value); }} />
                    </div>
                </div>
                <div className="field">
                    <label className="label">Description</label>
                    <div className="control">
                        <textarea className="textarea" placeholder="Video description" onChange={(e) => { setDescription(e.target.value) }}></textarea>                    </div>
                </div>


                <div className="file has-name">
                    <label className="file-label">
                        <input className="file-input" type="file" onChange={(e) => { setFile(e.target.files[0]) }} />


                        <span className="file-cta">
                            <span className="file-icon">
                                <i className="fas fa-upload"></i>
                            </span>
                            <span className="file-label">
                                Choose a file…
                            </span>
                        </span>
                        {file && (
                            <span className="file-name">
                                {file.name}
                            </span>
                        )}
                    </label>
                </div>

                <div className="field">
                    <label className="label">Token Contract, for token gated access to the video</label>
                    <div className="control">
                        <input className="input" type="text" placeholder="Token Contract address" name="TokenContract" onChange={(e) => { setTokenContract(e.target.value); }} />
                    </div>
                </div>

                <div>
                    <button className="button is-medium is-link" onClick={(e) => { uploadFile() }}>
                        Upload!
                    </button>
                </div>

            </div>




        </>
    );

}

export default Comp
