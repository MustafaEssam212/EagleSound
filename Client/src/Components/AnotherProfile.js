import React, {useState, useContext, useEffect} from "react";
import '../Styles/AnotherProfile.css'
import Header from "./Header";
import cover from '../Pics/cover.png'
import ProfilePic from '../Pics/profile2.png'
import {Helmet} from 'react-helmet'
import { useParams, useHistory } from "react-router-dom";
import ProfileImg from '../Pics/profile.png'
import {Link} from 'react-router-dom'
import axios from 'axios'
import tbg from '../Pics/tbg.png'
import {UserContext} from './User-Context'


function AnotherProfile(){

    const [SongPlayed, setSongPlayed] = useState('');
    const param = useParams();
    const UserInfo = useContext(UserContext);
    const [Click, setClick] = useState(false);
    const [Comment, setComment] = useState('');
    const [LikedL, setLikedL] = useState([]);
    const [PreLikes, setPreLikes] = useState([]);
    const [User, setUser] = useState({});    
    const [Following, setFollowing] = useState([]);
    const [Followers, setFollowers] = useState([]);
    const [Tracks, setTracks] = useState([]);
    const [avatars, setAvatars] = useState([]);



    useEffect(async ()=>{
     const id = await param.id;
     axios.post(`${process.env.REACT_APP_API}v1/getanotheruser`, {id})
     .then(res => {
         setUser(res.data)
         const user = JSON.parse(localStorage.getItem('UserStorage'))
         const email = user.email;
         axios.post(`${process.env.REACT_APP_API}v1/checklikes`, {email})
        .then(res => setPreLikes(res.data))
        
        })
    }, [])

    useEffect(async()=>{
        const id = param.id;
        const Id = param.id;
        axios.post(`${process.env.REACT_APP_API}v1/getfollow`, {id})
        .then(res => {
            setFollowing(res.data.following)
            setFollowers(res.data.followers)
            setTracks(res.data.tracks)
        })
        axios.post(`${process.env.REACT_APP_API}v1/getfollowers`, {Id})
        .then(res => setAvatars(res.data))
    }, [])


   
    

    function handleFollow(e){
        e.preventDefault();
        const Id = param.id;
        const id = param.id
        const myId = UserInfo.User._id;
        axios.post(`${process.env.REACT_APP_API}v1/follow`, {Id, myId})
        .then(res => {
            axios.post(`${process.env.REACT_APP_API}v1/getfollow`, {id})
        .then(res => {
            setFollowing(res.data.following)
            setFollowers(res.data.followers)
            setTracks(res.data.tracks)
        })
        })
    }

   

    return(

        <div className="ProfileContainer">

            <Helmet>
                <title>{!User.username  ? '' : User.username} | EagleSound</title>
            </Helmet>

            <Header />
            
            
            <div className="InnerProfile">
                <div id="NoSuccess"></div>
                
                    <div className="Top-Profile img-fluid">
                        <img className=" Cover" src={cover}></img>
                        <div className="ProfilePicDiv">
                            <img className="ProfilePic img-fluid" src={User.avatar === null ? ProfilePic : `../Data/Profiles/${User.avatar}`}></img>
                            <p className="ProfileName">{User.username}</p>
                        </div>
                        
                        
                    </div>

                    <div className="After-Top">
                    <div className="Profile-Info">
                                <p>{Followers.length} Followers</p>
                                    <div className="Hori"></div>
                                <p>{Following.length} Following</p>
                                    <div className="Hori"></div>
                                <p>{Tracks.length} Tracks</p>
                            </div>
                        <div className="Follow-Edit">
                            <button onClick={handleFollow} className="FollowBtn">{Followers.includes(UserInfo.User._id) ? <span><i className="fas fa-user-minus"></i> Unfollow</span> : <span><i className="fas fa-plus"></i> Follow</span>}</button>
                            
                        </div>
                    </div>

                    <div className="ProfileUnderContainer">

                        

                        <div className="SoundsProfile">





                            {
                                Tracks.map((e, key)=>{
                                    return  <div className="SoundProfile">
                                    <div className="SoundImageProfile"><img src={e.thumbnail === null ? tbg : `../Data/Sounds/${e.thumbnail}`}></img></div>
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
                                                
                                                <Link to={`/Play/${e.id}?value=${e.author}`}>{e.trackName}</Link>
                                            </div>
                                                
                                        </div>
                                        
                                        <audio className="Wave"  id={key} controls>
                                            <source src={`../Data/Sounds/${e.trackSong}`}></source>
                                        </audio>
                                        <div className="Comments">
                                            <form>
                                                <img className="CommentImg" src={UserInfo.User.avatar === null ? ProfileImg : `../Data/Profiles/${UserInfo.User.avatar}`}></img>
                                                <input type='text' onChange={(e)=>setComment(e.target.value)} placeholder="Wirte a comment"></input>
                                            </form>
                                        </div>
                                        <div className="Reacts">
                                                <button onClick={(es)=>{
                                                    es.preventDefault();
                                                    const Author = e.author;
                                                    const TrackId = e.id;
                                                    const email = UserInfo.User.email;
                                                         axios.post(`${process.env.REACT_APP_API}v1/likesomeonetrack`, {email, TrackId, Author})
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
    
                                                         
                                                }}>{PreLikes.includes(e.id) ? <i className="fas fa-heart LikedColor"></i> : <i className="fas fa-heart"></i>} {e.likes.length}</button>
                                        </div>
                                    </div>
                                </div>
                                })
                            }

                            

                        </div>

                      <div className="AnotherDiv">

                      <div className="People Likes">
                      <p className="PeopleHead"><i className="fas fa-user-friends"></i> Followers</p>
                      <hr className="HrInfo"></hr>


                            <div className="FollowersAprofile">
                                <div className="FollowerA">
                                    {
                                        avatars.length === 0 ? <span></span> : avatars.map((e)=>{
                                            return <img src={e.avatar === null ? ProfilePic : `../Data/Profiles/${e.avatar}`}/>
                                        })
                                    }
                                </div>
                            </div>

                      
                          <div className="LinkCenter">
                              <Link className="SeeAll">See All</Link>
                          </div>
                        </div>


                      </div>
                    </div>
                        
                       
            </div>
                                            
        </div>
    )
}

export default AnotherProfile;