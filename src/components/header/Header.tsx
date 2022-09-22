import React, { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { clearLogin, getCredentials } from '../../utils/login';
import { reqConfig } from '../../utils/request';
import './header.scss';

interface IProps {
    isUploaded: boolean, 
    setIsUploaded: (isShowModal:boolean) => void 
}

type TFileChange = React.ChangeEvent<HTMLInputElement>

export const Header = (props: IProps) => {
    let formData = useRef<FormData | null>(null);
    const [isShowModal, setShowModal] = useState(false)
    let [progress, setProgress] = useState(0);
    const [picInfo, setPicInfo] = useState({
        name: '',
        type: '',
    });
    const [videoInfo, setVideoInfo] = useState({
        name: '',
        type: '',
    });
    // upload the files as multipart
    const pic = useRef<HTMLInputElement>(null);
    const video = useRef<HTMLInputElement>(null);
    const selectPic = (event: TFileChange) => {
        console.log('files:',event.target.files);
        const file = event.target.files?.[0]
        console.log('file:', file);
        setPicInfo({
            name: file?.name ?? '',
            type: file?.type ?? '',
        })
        if(file){
            if (!formData.current) {
                // upload the files as multipart
                formData.current = new FormData();
            }
            formData.current.append(file.name, file)
            console.log('formData.current:', formData.current)
        }
    }
    const selectVideo = (event: TFileChange) => {
        const file = event.target.files?.[0]
        setVideoInfo({
            name: file?.name ?? '',
            type: file?.type ?? '',
        })
        if(file){
            if (!formData.current) {
                // upload the files as multipart
                formData.current = new FormData();
            }
            formData.current.append(file.name, file)
        console.log('formData.current:', formData.current)

        }
    }
    const showUploadModal = () => {
        // upload the files as multipart
        formData.current = null;
        setProgress(0);
        setShowModal(true)
    }
    const login = () => {
        if (getCredentials().token) {
            clearLogin()
        }
        window.location.href = '/login';
    }
    
    const upload = () => {
        const xhr = new XMLHttpRequest()
        xhr.open('POST', reqConfig.url + '/video/upload')
        // add the token & key to go through the auth check
        xhr.setRequestHeader('token', getCredentials().token);
        xhr.setRequestHeader('key', getCredentials().key);
        let interval: any;
        xhr.onerror = () => {
            toast('Upload fails: ' + xhr.responseText ?? ' No response.'); 
            clearInterval(interval);
        };
        xhr.onreadystatechange = function(){
            console.log('xhr.readyState:', xhr.readyState, 'xhr.status:', xhr.status);

            if(xhr.readyState === 4 && xhr.status === 200){
                const res = JSON.parse(xhr.responseText) as any;
                if (res.success !== true) {
                    toast('Upload failed: ' + res.message)
                } else {
                    cleanUploadInput()
                    setProgress(100);
                    toast('Upload success!')
                    setTimeout(() => {
                        setShowModal(false)
                        props.setIsUploaded(!props.isUploaded);
                    }, 1000)
                    
                }
            }
        }
        setProgress(0);
        console.log('formData.current:', formData.current)
        xhr.send(formData.current)
        let p = 0;
        interval = setInterval(() => {
        if (p >= 76) {
            clearInterval(interval);
        } else {
            p += parseInt(Math.random() * 5 + '', 10);
            setProgress(p > 76 ? 76 : p);
        }
        }, parseInt(Math.random() * 20 + '', 10) * 100);
    }
    function cleanUploadInput() {
        setProgress(0);
        setPicInfo({
            name: '',
            type: '',
        })
        setVideoInfo({
            name: '',
            type: '',
        })
        if(pic && pic.current && pic.current.value){
            pic.current.value = ''
        }
        if(video && video.current && video.current.value){
            video.current.value = ''
        }
    }
    function cancel() {
        cleanUploadInput();
        setShowModal(false)
    }
    function clickSelectPic() {
        if(pic && pic.current){
            pic.current.click();
        }
    }
    function clickSelectVideo() {
        if(video && video.current){
            video.current.click();
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
                {
                    getCredentials().token && (
                        <button className="upload" onClick={showUploadModal} style={{marginRight: '10px'}}>
                            Upload video
                        </button>
                    )
                }
                <button className="login" onClick={login}>
                    {getCredentials().token ? 'Logout' : 'login'}
                </button>
            </div>
            {
                isShowModal && (
                    <div className='modal' >
                        <div className='modalContainer' >
                            <div className='modal-header'>
                                Upload video
                            </div>
                            <div className='modal-main'>
                                <input type={"file"} accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,image/bmp" id='pic' ref={pic} className="fileInput" onChange={selectPic}/>
                                <input type={"file"} accept="video/mp4,video/mpg,video/mov" id='video' ref={video} className="fileInput" onChange={selectVideo}/>
                                {progress === 0 && (<div className="boxs">
                                    <div
                                        className="picFile boxBlock"
                                        onClick={clickSelectPic}
                                    >
                                        <div className="box boxPic">
                                            <img
                                                className="cameraIcon"
                                                src={'../../../assets/camera.png'}
                                            />
                                            {picInfo.name && (
                                                <img
                                                    className="checkedIcon"
                                                    src={'../../../assets/checked.png'}
                                                />
                                            )}
                                        </div>
                                        <div className="label">
                                            <span className="labelText">Select the cover picture</span>
                                        </div>
                                    </div>
                                    <div
                                        className="videoFile boxBlock"
                                        onClick={clickSelectVideo}
                                    >
                                        <div className="box boxVideo">
                                            <img
                                                className="videoIcon"
                                                src={'../../../assets/video.png'}
                                            />
                                            {videoInfo.name && (
                                                <img
                                                    className="checkedIcon"
                                                    src={'../../../assets/checked.png'}
                                                />
                                            )}
                                        </div>
                                        <div className="label">
                                            <span className="labelText">Select training video</span>
                                        </div>
                                    </div>
                                </div>)}
                                {progress !== 0 && (
                                    <div className="progressBar">
                                        <div className='progressTitle'>
                                            <span className='progressTitleText'>Upload 2 files</span>
                                        </div>
                                        <div className="progress">
                                            <div
                                                className='progressInner'
                                                style={{width: progress + '%'}}
                                            />
                                        </div>
                                        <div className="progressNumerText">
                                            {progress < 100 ? progress + '%' : 'Done'}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className='modal-footer'>
                                <button onClick={cancel}>cancel</button>
                                <button onClick={upload} style={{marginLeft: '10px', color: 'white', backgroundColor: '#065fd4'}}>Upload</button>
                            </div>
                        </div>
                    </div>
                )
            }
            <Toaster />
        </header>
    )
}