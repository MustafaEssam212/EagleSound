import React, {useContext, useEffect, useRef, useState} from "react";
import '../Styles/Play.css'
import Header from "./Header";
import {Helmet} from 'react-helmet';
import WaveSurfer  from 'wavesurfer.js'
import {Link, useParams} from 'react-router-dom'
import Asala from '../Pics/hrof.jpg'
import ProfileImg from '../Pics/profile.png'
import axios from 'axios';
import { useLocation } from 'react-router';
import tbg from '../Pics/tbg.png'
import { UserContext } from "./User-Context";
function Play(){

    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }

    const query = useQuery();
    var value = query.get('value');
    const param = useParams();
    const [Comment, setComment] = useState('');
    const waveformRef = useRef();
    const [WavePlayer, setWavePlayer] = useState();
    const [Click, setClick] = useState(false);
    const [Track, setTrack] = useState([]);
    const [User, setUser] = useState([]);
    const [TrackComments, setTrackComments] = useState([]);
    const UserInfo = useContext(UserContext);
    const [PreLikes, setPreLikes] = useState([]);


    useEffect(()=>{
        const Id = param.id;
        const TrackId = param.id;
        const Author = value;
        axios.post(`${process.env.REACT_APP_API}v1/gettrack`, {Id, Author})
        .then(res => setTrack(res.data))
        axios.post(`${process.env.REACT_APP_API}v1/getplayuser`, {Author})
        .then(res => setUser(res.data))
        axios.post(`${process.env.REACT_APP_API}v1/getcomments`, {TrackId, Author})
        .then(res => setTrackComments(res.data))
    }, [])

    

    useEffect(()=>{
        var wave = WaveSurfer.create({ 
            container: waveformRef.current,
            hideScrollbar: true,
            progressColor: '#FF5500',
            responsive: true,
            waveColor: '#FFFFFF',
            cursorColor: 'transparent'
          });
          wave.load(`../Data/Sounds/${Track.trackSong}`)
          setWavePlayer(wave)
          
    }, [Track])


    function PlaySong(){
        if(Click === false){
            WavePlayer.play();
            setClick(true)
        }else{
            WavePlayer.pause();
            setClick(false)
        }
    }

    function handlePlayComment(e){
        e.preventDefault();
        const email = UserInfo.User.email;
        const TrackId = param.id;
        const Author = value;
        axios.post(`${process.env.REACT_APP_API}v1/commenttrack`, {Comment, email, TrackId, Author})
        .then(res => {
            document.getElementById('CommentInput').value = '';
            axios.post(`${process.env.REACT_APP_API}v1/getcomments`, {TrackId, Author})
            .then(res => setTrackComments(res.data))
        }) 
    }


    function LikeThisTrack(e){
        e.preventDefault();
        const Author = value;
        const TrackId = param.id;
        const email = UserInfo.User.email;
        axios.post(`${process.env.REACT_APP_API}v1/likesomeonetrack`, {Author, TrackId, email})
        .then(response => {
            axios.post(`${process.env.REACT_APP_API}v1/checklikes`, {email})
            .then(res => {
                setPreLikes(res.data)
                
            })
        })
    }

    return(

        <div>

            <Helmet>
                <title>{Track.trackName}</title>
            </Helmet>

            <Header />
            
                <div className="InnerPlay">
                    

                    <div className="Top-Play">

                        <div className="SongName-Wave">

                            <div className="SongName-Date"> 
                                <button onClick={PlaySong}>{Click === false ? <i className="fas fa-play"></i> : <i className="fas fa-pause"></i>}</button>
                                <div className="SongInfoTop">
                                    <p className="SongNameExist">{Track.trackName}</p>
                                    <Link to={`/Profile/${User._id}`} className="ChannelNameTop">{User.username}</Link>
                                </div>
                            </div>

                            <div className="Pwave">
                            <div ref={waveformRef} className="WavePlayer">

                            </div>
                            </div>

                        </div>


                            <div className="TopPlayImg">
                            <img className="TopImg" src={Track.thumbnail === null ? tbg : `../Data/Sounds/${Track.thumbnail}`}></img>
                            </div>
                    </div>



                    <div className="PlayContainer">

                            <div className="LeftPlay">

                                <div className="Comments PlayComments">
                                            <form onSubmit={handlePlayComment}>
                                                <img className="CommentImg" src={UserInfo.User.avatar === null ? ProfileImg : `../Data/Profiles/${UserInfo.User.avatar}`}></img>
                                                <input id="CommentInput" type='text' onChange={(e)=>setComment(e.target.value)} placeholder="Wirte a comment"></input>
                                            </form>
                                </div>

                                <div className="PlayBtns">
                                    <div className="Copy-Like">
                                        <button onClick={LikeThisTrack}>{PreLikes.includes(Track.id) ? <i className="fas fa-heart LikedColor"></i> : <i className="fas fa-heart"></i>} Like</button>
                                        <button><i className="fas fa-link"></i> Copy Link</button>
                                    </div>
                                    <div className="PlayIcons">
                                        <p><i className="fas fa-play"></i> </p>
                                        <p><i className="fas fa-heart"></i> {Track.likes  == null ? '' : Track.likes.length}</p>
                                        <p><i class="fas fa-retweet"></i> </p>
                                    </div>
                                </div>

                                <hr className="HrPlay"/>


                                <div className="Profile-Comments">
                                    <div className="ProfileSong">
                                      <img className="ProfileSongImg" src={User.avatar === null ? ProfileImg : `../Data/Profiles/${User.avatar}`}></img>
                                      <p>{User.username}</p>
                                      <div>
                                          <p><i className="fas fa-user-friends"></i> {User.followers == null ? '' : User.followers.length}</p>
                                          <p><i className="fas fa-music"></i> {User.tracks == null ? '' : User.tracks.length}</p>
                                      </div>
                                      <button className="FollowProfileSong">Follow</button>
                                    </div>

                                    <div className="CommentsSong">
                                        <p className="CommentSongP"><i className="fas fa-comment"></i> {Track.comments == null ? '' : Track.comments.length} comments</p>
                                        <hr className="HrComments"/>

                                        <div className="CommentsInner">
                                            {
                                                TrackComments.length === 0 ? <span></span> : <>
                                                    {
                                                        TrackComments.map((element, key)=>{
                                                            return <div className="Comment">
                                                            <img src={element.avatar === null ? ProfileImg : `../Data/Profiles/${element.avatar}`}></img>
                                                                <div>
                                                                    <Link>{element.username}</Link>
                                                                    <p>{element.Commentext}</p>
                                                                </div>
                                                        </div>
            
                                                        })
                                                    }
                                                </>
                                            }
                                            
                                            

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="RightPlay">
                                <div className="People Likes Related">
                                    <p className="PeopleHead"><i className="fas fa-music"></i> Related Tracks</p>
                                    <hr className="HrInfo"></hr>

                                    <div className="Liked">
                                        <div className="LikedImage">
                                            <Link><img src={Asala}></img>
                                            <i className="fas fa-play DiscPlayIcon" id="DiscIcon"></i>
                                            </Link>
                                        </div>
                                        <div className="LikedInfo">
                                        <Link className="ChannelNameDisc">Asala Artist</Link>
                                        <Link className="SongNameDisc">This is My Song Name For Asala Artist ...</Link>
                                        <div className="LikedIcons">
                                            <span><i className="fas fa-play"></i> 1251</span>
                                            <span><i className="fas fa-heart"></i> 1000</span>
                                            <span><i className="fas fa-retweet"></i> 500</span>
                                            <span><i className="fas fa-comment"></i> 10</span>
                                        </div>
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

export default Play;