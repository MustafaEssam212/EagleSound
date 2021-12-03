import React, {useState, useContext} from 'react';
import '../Styles/Upload.css'
import Header from './Header'
import { ProgressBar  } from 'react-bootstrap';
import tbg from '../Pics/tbg.png'
import axios from 'axios';
import { UserContext } from './User-Context';
import {Link} from 'react-router-dom';
import {Helmet} from 'react-helmet';

function Upload(){


    const [File, setFile] = useState('');
    const [SongName, setSongName] = useState('');
    const [Tags, setTags] = useState([]);
    const [Tag, setTag] = useState({
        tag: '',
    })
    const [Thumbnail, setThumbnail] = useState('');
    const [Chosen, setChosen] = useState('');
    const UserInfo = useContext(UserContext);
    const [Success, setSuccess] = useState('');
    const [Error, setError] = useState('');
    const [UploadPercent, setUploadPercent] = useState('0');


    function handeAddTags(s){
        s.preventDefault();
        setTags([...Tags, Tag])
        document.getElementById('TagInput').value = ''
    }



    function ChangeTBG(s){
        setThumbnail(s.target.files[0])
        
        const reader = new FileReader();
        reader.onload = () =>{
            if(reader.readyState === 2){
                setChosen(reader.result)
            }
        }
        if(s.target.files[0]){
            reader.readAsDataURL(s.target.files[0]);
          }
    }


    const config = {
        onUploadProgress: function(progressEvent) {
          var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadPercent(percentCompleted)
        }
      }

    function handleUploadTrack(s){
        s.preventDefault();
        const data = new FormData();
        data.append('track', File);
        data.append('thumbnail', Thumbnail);
        data.append('songname', SongName);
        data.append('tags', JSON.stringify(Tags))
        data.append('email', UserInfo.User.email)
        axios.post(`${process.env.REACT_APP_API}v1/uploadtrack`, data, config)
        .then(res => {
            if(res.data.message === 'Track uploaded successfully'){
                setSuccess(res.data.message)
            }else{
                setError(res.data.message)
            }
        })
    }

   

    return(

        <div className='UploadContainer'>

            <Helmet>
                <title>Upload track | EagleSound</title>
            </Helmet>
        
            <Header />
            

            {
                File === '' ? <div className='InnerUpload'>
                                    <div className='Upload'>
                                        <h2>Upload your track here</h2>
                                        <form enctype="multipart/form-data">
                                        <label>
                                            Choose file to upload
                                            <input onChange={(s)=>setFile(s.target.files[0])} className='UploadInpu' type='file' accept='audio/*'></input>
                                        </label>
                                        </form>
                                    </div>
                                </div>

                                :

                                <div className='AfterUpload'>

                                    
                                    <div className='Progress'>
                                        <h3>Uploading {UploadPercent}%</h3>
                                        <ProgressBar animated now={UploadPercent}></ProgressBar>
                                    </div>
                                    
                                    <div className='EditUploadInfo'>
                                        <div className='LeftUpload'>
                                            <img src={Chosen === '' ? tbg : Chosen}></img>
                                            <label className='UploadIm'>
                                                <i className="fas fa-camera"></i> Upload Image
                                                <input onChange={ChangeTBG} className='UploadInpu' type='file' accept='image/*'></input>
                                            </label>
                                        </div>

                                        <div className='RightUpload'>
                                            <form>
                                                <div>
                                                    <label>Title*</label>
                                                    <input placeholder='Track name' onChange={(s)=>setSongName(s.target.value)} defaultValue={File.name} type='text'></input>
                                                </div>
                                                <div className='TagsDiv'>
                                                    <label>Additional tags*</label>
                                                    <input id='TagInput' onChange={(s)=>setTag({tag: s.target.value})} type='text'></input>
                                                    <button onClick={handeAddTags} id={Tag.tag === '' ? "Nothing" : "BtnAdd"}>Add</button>
                                                </div>
                                                <div>
                                                    <label>Description</label>
                                                    <textarea ></textarea>
                                                </div>
                                                <button onClick={handleUploadTrack} type='submit'>Upload</button>
                                            </form>
                                        </div>

                                    </div>

                                </div>

            }


                            <div className='Errors'>

                                <div className="BigPop">
                            
                                    <div className={Success === '' ? "Nothing" : "SuccessPop"}>
                                        <i className="fas fa-check-circle PopI"></i>
                                        <div>
                                            <p className="PopTitle">Success!</p>
                                            <p className="PopMess">{Success} <Link to={`/Profile/${UserInfo.User._id}`}>click here to manage your tracks</Link></p>
                                        </div>
                                        <i onClick={()=>setSuccess('')} className="fas fa-times PopClose"></i>
                                    </div>

                                </div>


                                <div className="BigPop">
                        
                                    <div className={Error === '' ? "Nothing" : "ErrorPop"}>
                                        <i className="fas fa-times-circle PopI"></i>
                                        <div>
                                            <p className="PopTitle">Error!</p>
                                            <p className="PopMess">{Error}</p>
                                        </div>
                                        <i onClick={()=>setError('')} className="fas fa-times PopClose"></i>
                                    </div>

                                </div>

                            </div>

        </div>

    )
}

export default Upload;