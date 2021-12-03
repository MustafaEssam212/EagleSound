import React, {useEffect, useState} from "react";
import '../Styles/Search.css'
import { useLocation } from 'react-router';
import Header from "./Header";
import axios from "axios";
import {Link} from 'react-router-dom';
import ProfilePic from '../Pics/profile.png'
import { Helmet } from "react-helmet";
import { CircleToBlockLoading } from 'react-loadingg';
import tbg from '../Pics/tbg.png'

function Search(){

    function useQuery() {
        return new URLSearchParams(useLocation().search);
      }
    const query = useQuery();
    var value = query.get('value');
    const [Users, setUsers] = useState([]);
    const [Tracks, setTracks] = useState([]);
    const [TrackClicked, setTrackClicked] = useState(false);
    const [UsersClicked, setUsersClicked] = useState(true);
    const [Loading, setLoading] = useState(false)
    const color = '#FF5500';
    const token = localStorage.getItem('Token')

    useEffect(()=>{
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API}v1/search`, {value})
        .then(res => {
          setTracks(res.data.TracksResults)
          setUsers(res.data.UsersResults)
          setLoading(false)
        })
    }, [])

    useEffect(()=>{
        setLoading(true)
        axios.post(`${process.env.REACT_APP_API}v1/search`, {value})
        .then(res => {
          setTracks(res.data.TracksResults)
          setUsers(res.data.UsersResults)
          setLoading(false)
        })
    }, [value])
    
    
    return(

        <>

                <Helmet>
                    <title>{value} Search | EagleSound</title>
                </Helmet>

                {
                    !token ? <></> : <Header />
                }

                <div className="SearchContainer">


                        <div className="SearchBtns">
                            <button onClick={()=> {
                                setTrackClicked(false)
                                setUsersClicked(true)
                            }} className={UsersClicked === true ? "ActiveBtn" : "NotActive"}>Users</button>
                            <button onClick={()=> {
                                setTrackClicked(true)
                                setUsersClicked(false)
                            }} className={TrackClicked === true ? "ActiveBtn" : "NotActive"}>Tracks</button>
                        </div>

                            
                        <div className={UsersClicked === true ? "Users" : "Nothing"}>

                            

                           
                           {
                                Loading === true ? <div className="SoundsLoading"><CircleToBlockLoading color={color}/></div> : <>
                                
                                {
                                    Users.length === 0 ? <div className="NoResults">No results matchs your search word</div> : <>
                                    
                                        {
                                            Users.map((e)=>{
                                                return <div className="UserDiv">
                                
                                                <Link to={`/Profile/${e._id}`}><img src={e.avatar === null ? ProfilePic : `../Data/Profiles/${e.avatar}`}></img></Link>
                                
                                                <div className="UserDivDet">
                                                    <Link to={`/Profile/${e._id}`}>{e.username}</Link>
                                                    <div>
                                                        <p><i className="fas fa-user-plus"></i> {e.followers.length}</p>
                                                        <p><i className="fas fa-music"></i> {e.tracks.length}</p>
                                                    </div>
                                                </div>
                                
                                            </div>
                                            })
                                        }

                                    </>
                                }
                                
                                </>
                           }


                        </div>
                        
                        <div className={TrackClicked === true ? "Tracks" : "Nothing"}>
                        {
                                    Tracks.length === 0 ? <div className="NoResults">No results matchs your search word</div> : <>
                                    
                                        {
                                            Tracks.map((e)=>{
                                                return <div className="TrackDiv">
                                
                                                <Link to={`/Play/${e.id}`}><img src={e.thumbnail === null ? tbg : `../Data/Sounds/${e.thumbnail}`}></img></Link>
                                
                                                <div className="TrackDivDet">
                                                    <Link to={`/Play/${e.id}`}>{e.trackName}</Link>
                                                    <div>
                                                        <p><i className="fas fa-heart"></i> {e.likes.length}</p>
                                                        <p><i className="fas fa-comment"></i> {e.comments.length}</p>
                                                    </div>
                                                </div>
                                
                                            </div>
                                            })
                                        }

                                    </>
                                }
                        </div>

                        <div className="BackHome">
                            <Link to="/">Back to home page</Link>
                        </div>
                        
                </div>

        </>
    )
}

export default Search;