import React, {useState, useEffect, useContext} from "react";
import '../Styles/Profile.css'
import Header from "./Header";
import cover from '../Pics/cover.png'
import ProfilePic from '../Pics/profile2.png'
import {Helmet} from 'react-helmet'
import axios from 'axios';
import ProfileImg from '../Pics/profile.png'
import {Link, useParams} from 'react-router-dom'
import { UserContext } from "./User-Context";
import tbg from '../Pics/tbg.png'
import { CircleToBlockLoading } from 'react-loadingg';
import AnotherProfile from './AnotherProfile';


function Profile(){

 
    const param = useParams();
    const [Click, setClick] = useState(false);
    const [Comment, setComment] = useState('');
    const [SongPlayed, setSongPlayed] = useState('');
    const UserInfo = useContext(UserContext);
    const [profile, setProfile] = useState('');
    const [Chosen, setChosen] = useState('');
    const [Pop, setPop] = useState(false);
    const [Pop2, setPop2] = useState(false);
    const [Error, setError] = useState('');
    const [Success, setSuccess] = useState('');
    const [UserTracks, setUserTracks] = useState([]);
    const [Loading, setLoading] = useState(false)
    const color = '#FF5500';
    const [LikedL, setLikedL] = useState([]);
    const [PreLikes, setPreLikes] = useState([]);
    const [AlreadyLiked, setAlreadyLiked] = useState([]);
    const [Comments, setComments] = useState([]);

  

    function handleChangeProfile(s){
        setProfile(s.target.files[0])
        setPop(true)
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

    function handleChangeProfilePic(s){
        s.preventDefault();
        const data = new FormData();
        const email = UserInfo.User.email
        const Id = param.id;
        data.append('profile', profile)
        data.append('email', email)
        axios.post(`${process.env.REACT_APP_API}v1/uploadprofile`, data)
        .then(res => {
            if(res.data.message === 'Profile picture changed successfully'){
                setSuccess(res.data.message)
                setPop(false)
                axios.post(`${process.env.REACT_APP_API}v1/getuserdata`, {Id})
                .then(res =>{
                    UserInfo.setUser(res.data)
                    localStorage.setItem('UserStorage', JSON.stringify(res.data))  
                })
            }else{
                setError(res.data.message)
                setPop(false)
            }
        })
    }

    useEffect( ()=>{
        setLoading(true)
        const user = JSON.parse(localStorage.getItem('UserStorage'))
        const email = user.email;
        axios.post(`${process.env.REACT_APP_API}v1/getusertracks`, {email})
        .then(res => {
            setUserTracks(res.data)
            axios.post(`${process.env.REACT_APP_API}v1/checklikes`, {email})
            .then(res => setPreLikes(res.data))
            setLoading(false)
        })
    }, [])

    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem('UserStorage'))
        const email = user.email;
        axios.post(`${process.env.REACT_APP_API}v1/alreadyliked`, {email})
        .then(res => setAlreadyLiked(res.data))
    }, [])


  
   

    return(

       <>
            {
                param.id === UserInfo.User._id ?  <div className="ProfileContainer">

                <Helmet>
                    <title>{UserInfo.User.username} | EagleSound</title>
                </Helmet>
    
                <Header />
                
                
                <div className="InnerProfile">
                    <div id="NoSuccess"></div>
                    
                        <div className="Top-Profile img-fluid">
                            <img className=" Cover" src={cover}></img>
                            <div className="ProfilePicDiv">
                                <img className="ProfilePic img-fluid" src={UserInfo.User.avatar === null ? ProfilePic : `../Data/Profiles/${UserInfo.User.avatar}`}></img>
                                <p className="ProfileName">{UserInfo.User.username}</p>
                            </div>
                            <div className="UploadNewProf" id="UpIn">
                                <form enctype="multipart/form-data">
                                <label className='UploadIm2'>
                                    <i className="fas fa-camera"></i> Upload Image
                                    <input onChange={handleChangeProfile} className='UploadInpu' type='file' accept='image/*'></input>
                                </label>
                                </form>
                            </div>
                            <div className="UploadNewCov">
                                <label className='UploadIm2'>
                                    <i className="fas fa-camera"></i> Upload cover image
                                    <input className='UploadInpu' type='file' accept='image/*'></input>
                                </label>
                            </div>
                        </div>
    
                        <div className="After-Top">
                            <div className="Profile-Info">
                                <p>0 Followers</p>
                                    <div className="Hori"></div>
                                <p>0 Following</p>
                                    <div className="Hori"></div>
                                <p>{UserInfo.User.tracks.length} Tracks</p>
                            </div>
                            <div className="Follow-Edit">
                                
                                <button className="EditBtn"><i className="fas fa-edit"></i> Edit</button>
                            </div>
                        </div>
    
                        <div className="ProfileUnderContainer">
    
                            
    
                            <div className="SoundsProfile">
                            
                                {
                                    Loading === true ? <div className="SoundsLoading"><CircleToBlockLoading color={color}/></div> : <>
                                    
                                    {
                                    UserTracks.map((element, key)=>{
                                        return <div className="SoundProfile">
                                        <div className="SoundImageProfile"><img src={element.thumbnail === null ? tbg : `../Data/Sounds/${element.thumbnail}`}></img></div>
                                        <div>
                                            <div className="SoundDetProfile">
                                                <div className="Play-Name">
                                                    <button onClick={()=>{
                                                    
                                                        if(Click === false){
                                                            document.getElementById(key).play();
                                                            setClick(true)
                                                            setSongPlayed(key)
                                                        }else{
                                                            document.getElementById(key).pause();
                                                            setClick(false)
                                                            setSongPlayed('')
                                                        }
                                                        
                                                    
                                                    }}>{SongPlayed !== key ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}</button>
                                                    
                                                    <Link>{element.trackName.length > 35 ? element.trackName.slice(0,35) + '...' : element.trackName}</Link>
                                                </div>
                                                    
                                            </div>
                                            
                                            <audio className="Wave" id={key} controls>
                                                <source src={`../Data/Sounds/${element.trackSong}`}></source>
                                            </audio>
                                            <div className="Comments">
                                                <form onSubmit={(e)=>{
                                                        e.preventDefault();
                                                        const email = UserInfo.User.email;
                                                        const Author = element.author;
                                                        const TrackId = element.id;
                                                        axios.post(`${process.env.REACT_APP_API}v1/commenttrack`, {Comment, email, Author, TrackId})
                                                        .then(res => document.getElementById(key + '1').value = '')
                                                        
                                                }}>
                                                    <img className="CommentImg" src={UserInfo.User.avatar === null ? ProfileImg : `../Data/Profiles/${UserInfo.User.avatar}`}></img>
                                                    <input id={key + '1'} type='text' onChange={(e)=>setComment(e.target.value)} placeholder="Wirte a comment"></input>
                                                </form>
                                            </div>
                                            <div className="Reacts">
                                                    <button onClick={(e)=>{
                                                         e.preventDefault();
                                                         const user = JSON.parse(localStorage.getItem('UserStorage'))
                                                         const email = user.email;
                                                         const TrackId = element.id;
                                                         axios.post(`${process.env.REACT_APP_API}v1/liketrack`, {email, TrackId})
                                                        .then(response => {
                                                            axios.post(`${process.env.REACT_APP_API}v1/checklikes`, {email})
                                                            .then(res => {
                                                                setPreLikes(res.data)
                                                                
                                                            })
                                                        })
                                                         if(LikedL.includes(key)){
                                                            setLikedL( LikedL.filter(e => e !== key))
                                                         }else{
                                                            setLikedL([...LikedL, key])
                                                         }
    
                                                         
                                                         
                                                    }}>{PreLikes.includes(element.id) ? <i className="fas fa-heart LikedColor"></i> : <i className="fas fa-heart"></i>} {element.likes.length}</button>
    
                                                    <button onClick={()=> {
                                                        const Author = element.author;
                                                        const TrackId = element.id;
                                                        axios.post(`${process.env.REACT_APP_API}v1/getcomments`, {Author, TrackId})
                                                        .then(res => {
                                                            setComments(res.data)
                                                            setPop2(true)
                                                        })
                                                        
                                                    }} className="CommentsButton"><i className="fas fa-comment"></i> {element.comments.length}</button>
                                            </div>
                                        </div>
                                    </div>
        
                                    })
                                }
    
                                    </>
                                }
    
    
                                
    
                                
    
                            </div>
    
                          <div className="AnotherDiv">
    
                          <div className="People Likes">
                          <p className="PeopleHead"><i className="fas fa-heart"></i> {PreLikes.length} Likes</p>
                          <hr className="HrInfo"></hr>
    
                          {
                              AlreadyLiked.map((e)=>{
    
                                return <div className="Liked"> 
                                        
                                        <div className="LikedImage">
                                <Link><img src={e.thumbnail === null ? tbg : `../Data/Sounds/${e.thumbnail}`}></img>
                                <i className="fas fa-play DiscPlayIcon" id="DiscIcon"></i>
                                </Link>
                            </div>
                            <div className="LikedInfo">
                              
                              <Link className="SongNameDisc">{e.trackName.length > 38 ? e.trackName.slice(0, 37) + '...' : e.trackName}</Link>
                              <div className="LikedIcons">
                                  <span><i className="fas fa-play"></i> 0</span>
                                  <span><i className="fas fa-heart"></i> {e.likes.length}</span>
                                  <span><i className="fas fa-retweet"></i> 0</span>
                                  <span><i className="fas fa-comment"></i> {e.comments.length}</span>
                              </div>
                            </div>                
    
                                </div>
    
                              })
                          }
    
                          
                              <div className="LinkCenter">
                                  <Link className="SeeAll">See All</Link>
                              </div>
                            </div>
    
    
                          </div>
                        </div>
                            
                           
                </div>
    
                <div className={Pop === false ? "Nothing" : "PopWindow"}>
                    <div className="InnerPopWin">
                        <img id='Preview' src={Chosen}></img>
                        <button onClick={handleChangeProfilePic} className="PopWinBtn">Save</button>
                        <i onClick={()=>setPop(false)} className="fas fa-times PopWinClose"></i>
                    </div>
                    
                </div>
    
                <div className={Pop2 === false ? "Nothing" : "PopWindow"}>
                    <div className="InnerPopWin">
    
                          <div className="ReviewComments">
                                <h5>Comments</h5>
                                
    
                                {
                                    Comments.map((e)=>{
                                        return <div className="RevComm"> 
    
                                                <img src={e.avatar === null ? ProfilePic : `../Data/Profiles/${e.avatar}`}></img>
    
                                                <div>
                                                    <p>{e.username}</p>
                                                    <p>{e.Commentext}</p>
                                                </div>
    
                                                <hr/>
    
                                        </div>
                                    })
                                }
                          </div>
    
                          <i onClick={()=>setPop2(false)} className="fas fa-times PopWinClose"></i>
                    </div>
                    
                </div>
    
    
                <div className="Errors">
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
    
                        <div className="BigPop">
                            
                            <div className={Success === '' ? "Nothing" : "SuccessPop"}>
                                <i className="fas fa-check-circle PopI"></i>
                                <div>
                                    <p className="PopTitle">Success!</p>
                                    <p className="PopMess">{Success}</p>
                                </div>
                                <i onClick={()=>setSuccess('')} className="fas fa-times PopClose"></i>
                            </div>
    
                        </div>
                </div>
    
                                                
            </div>

            :

            <AnotherProfile />
            }
       </>
    )
}

export default Profile;