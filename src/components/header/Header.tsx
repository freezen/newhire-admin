import React, { useRef } from 'react';
import { getCredentials } from '../../utils/login';
import { reqConfig } from '../../utils/request';
import './header.scss';

interface IProps {
    isShowModal: boolean, 
    setShowModal: (isShowModal:boolean) => void 
}

type TFileChange = React.ChangeEvent<HTMLInputElement>

export const Header = (props: IProps) => {
    // upload the files as multipart
    let formData = new FormData()
    const pic = useRef<HTMLInputElement>(null);
    const video = useRef<HTMLInputElement>(null);
    const selectPic = (event: TFileChange) => {
        console.log(event.target.files);
        const file = event.target.files?.[0]
        if(file){
            formData.append(file.name, file)
        }
    }
    const selectFile = (event: TFileChange) => {
        const file = event.target.files?.[0]
        if(file){
            formData.append(file.name, file)
        }
    }
    const showUploadModal = () => {
        // upload the files as multipart
        formData = new FormData()
        props.setShowModal(true)
    }
    const upload = () => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', reqConfig.url + '/video/upload')
        // add the token & key to go through the auth check
        xhr.setRequestHeader('token', getCredentials().token);
        xhr.setRequestHeader('key', getCredentials().key);
        xhr.onreadystatechange = function(){
            if(xhr.readyState === 4 && xhr.status === 200){
                cleanUploadInput()
            }
        }
        xhr.send(formData)
    }
    function cleanUploadInput() {
        props.setShowModal(false)
        if(pic && pic.current && pic.current.value){
            pic.current.value = ''
        }
        if(video && video.current && video.current.value){
            video.current.value = ''
        }
    }
    return (
        <header>
            <div className="leftBar">
                <button id="button" className="style-scope abc-button" aria-label="导视" aria-pressed="true">
                    <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" className="style-scope abc-icon"><g className="style-scope"><path d="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z" className="style-scope"></path></g></svg>
                </button>
                <div className='logo'>ABC Training Insight</div>
            </div>
            <div className="midBar">
            </div>
            <div className="rightBar">
                <button className="upload" onClick={showUploadModal}>
                    Upload video
                </button>
            </div>
            {
                props.isShowModal && (
                    <div className='modal' >
                        <div className='modal-header'>
                            Upload video
                        </div>
                        <div className='modal-main'>
                            <input type={"file"} id='pic' ref={pic} className="fileInput" style={{marginBottom: '20px'}} onChange={selectPic}/>
                            <input type={"file"} id='video' ref={video} className="fileInput" onChange={selectFile}/>
                        </div>
                        <div className='modal-footer'>
                            <button onClick={cleanUploadInput}>cancel</button>
                            <button onClick={upload} style={{marginLeft: '10px', color: 'white', backgroundColor: '#065fd4'}}>Upload</button>
                        </div>
                    </div>
                )
            }
        </header>
    )
}