import React, {useEffect, useState} from "react";
import '../Styles/Discover.css'
import Header from './Header'
import {Link} from 'react-router-dom'
import axios from 'axios'
import ProfilePic from '../Pics/profile2.png'
import tbg from '../Pics/tbg.png'
import { CircleToBlockLoading } from 'react-loadingg';
import {Helmet} from 'react-helmet'

function Discover(){


    const [Clicked, setClicked] = useState(false);
    const [ShouldFollow, setShouldFollow] = useState([]);
    const [AlreadyLiked, setAlreadyLiked] = useState([]);
    const [MostLiked, setMostLiked] = useState([]);
    const [FollowingUploads, setFollowingUploads] = useState([]);
    const [Loading, setLoading] = useState(false)
    const color = '#FF5500';


    useEffect(()=>{
        setLoading(true)
        axios.get(`${process.env.REACT_APP_API}v1/artistsshouldfollow`)
        .then(res => setShouldFollow(res.data))
        const user = JSON.parse(localStorage.getItem('UserStorage'))
        const email = user.email;
        axios.post(`${process.env.REACT_APP_API}v1/alreadyliked`, {email})
        .then(res => setAlreadyLiked(res.data))
        axios.get(`${process.env.REACT_APP_API}v1/mostliked`)
        .then(res => {
            setMostLiked(res.data)
            setLoading(false)
        })
        axios.post(`${process.env.REACT_APP_API}v1/followinguploads`, {email})
        .then(res => setFollowingUploads(res.data))
    }, [])      

    return(
        <div>

            <Helmet>
                <title>Home | EagleSound</title>
            </Helmet>
            
            <Header />

            {
                Loading === true ? <div className="SoundsLoading"><CircleToBlockLoading color={color}/></div> :    <div className="InnerIntroContainer">

                <div className="DiscoverContainer">
                         
                       <i onClick={()=>setClicked(!Clicked)} className={Clicked === false ? "fas fa-angle-double-left RightMenu" : "fas fa-angle-double-right RightMenu"}></i>
                   <div className="Plays">
                       <h2>Most Liked</h2>
                       <p>The most liked tracks on EagleSound this week</p>
                       <div className="MostLikedCaro">
                           
     
                         {
                             MostLiked.map((e, key)=>{
                                 return <div className='Sound' id={key}>
                                 <Link to={`/Play/${e.id}?value=${e.author}`} className='MainSoundA'>
                                     <i className="fas fa-play" id='PlayIcon'></i>
                                     <img src={e.thumbnail === null ? tbg : `../Data/Sounds/${e.thumbnail}`}></img>
                                     <Link title={e.trackName} to={`/Play/${e.id}?value=${e.author}`} id='SongName'>{e.trackName.length > 19 ? e.trackName.slice(0, 21) + '...' : e.trackName}</Link>
                                     
                                 </Link>
                               </div>
                             })
                         }
                         
                       </div>
                       <hr className="PlayHr"></hr>
     
                       <h2>Following Uploads</h2>
                       <p>These tracks of your following on EagleSound</p>
                       <div className="MostLikedCaro">
                       {
                             FollowingUploads.map((e, key)=>{
                                 return <div className='Sound' id={key}>
                                 <Link to={`/Play/${e.id}?value=${e.author}`} className='MainSoundA'>
                                     <i className="fas fa-play" id='PlayIcon'></i>
                                     <img src={e.thumbnail === null ? tbg : `../Data/Sounds/${e.thumbnail}`}></img>
                                     <Link title={e.trackName} to={`/Play/${e.id}?value=${e.author}`} id='SongName'>{e.trackName.length > 19 ? e.trackName.slice(0, 21) + '...' : e.trackName}</Link>
                                     
                                 </Link>
                               </div>
                             })
                         }
                           
                        
                       </div>
                       
     
                       
                   </div>
     
                   
                   <div className={Clicked === false ? "DiscoverInfo" : "MobileInfo"}>
     
                       <div className="People">
                           <p className="PeopleHead"><i className="fas fa-user-friends"></i> Artists you should follow</p>
                           <hr className="HrInfo"></hr>
     
                           {
                               ShouldFollow.length === 0 ? <span></span> : ShouldFollow.map((e, key)=>{
                                     return <div className="Person">
                                     <div className="PersonInfo">
                                         <div className="PersonImg">
                                             <Link to={`/Profile/${e._id}`}><img src={e.avatar === null ? ProfilePic : `../Data/Profiles/${e.avatar}`}></img></Link>
                                         </div>
                                         <div className="PersonDet">
                                               <div className="Name"><Link to={`/Profile/${e._id}`}>{e.username}</Link></div>
                                             <div className="InnerDet">
                                               <p><i className="fas fa-user-friends"></i> {e.followers.length}</p>
                                               <p><i className="fas fa-music"></i> {e.tracks.length}</p>
                                             </div>
                                         </div>  
                                     </div>
                                     <div className="FollowInput">
                                         <button><i className="fas fa-user-plus"></i> Follow</button>
                                     </div>
                                 </div>
                               })
                           }
                        
     
                       </div>
     
     
                       <div className="People Likes">
                           <p className="PeopleHead"><i className="fas fa-heart"></i> {AlreadyLiked.length} Likes</p>
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
            }
           
        </div>
    )
}

export default Discover;