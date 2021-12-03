import React, {useState, useContext} from "react";
import '../Styles/Header.css'
import Icon from '../Pics/icona.png'
import { Link } from "react-router-dom";
import Profile from '../Pics/profile.png'
import { UserContext } from "./User-Context";
import {useHistory} from 'react-router-dom'


function Header(){

  
    const [Ul, setUl] = useState(false);
    const [Bars, setBars] = useState(false);
    const UserInfo = useContext(UserContext);
    const history = useHistory();
    const [SearchInput, setSearchInput] = useState('');


    function handelUl(e){
        e.preventDefault();
        setUl(!Ul)
    }

    function handleLogOut(e){
        e.preventDefault()
        localStorage.clear()
        history.push('/')
    }

    function handleSearch(z){
        z.preventDefault();
        history.push(`/Search?value=${SearchInput}`)
    }

    return(

        <>

            <header className="HeaderContainer">
                    <Link to={`/Discover`}><img src={Icon} title="Home" alt="EagelSound"></img></Link>

                    <form onSubmit={handleSearch} className="HeaderDSearch">
                        <input type='text' onChange={(e)=>setSearchInput(e.target.value)} placeholder="Search"></input>
                        <button type="submit"><i className="fas fa-search"></i></button>
                    </form>

                    <div className={Bars === false ? "HeaderBtns" : "HeaderMobileBtns"}>
                        <Link to='/Upload' className="UploadBtn"><i className="fas fa-cloud-upload-alt"></i> Upload</Link>

                    <div className="HeaderMenu">
                        <button onClick={handelUl}><img src={UserInfo.User.avatar === null ? Profile : `../Data/Profiles/${UserInfo.User.avatar}`}></img> {UserInfo.User.username} <i class="fas fa-arrow-circle-down"></i></button>
                        
                        <ul className={Ul === false ? "NoSuccess" : "UlDis"}>
                            <li><Link to={`/Profile/${UserInfo.User._id}`}><i className="fas fa-user"></i> Profile</Link></li>
                            <li><Link><i className="fas fa-heart"></i> Likes</Link></li>
                            <li><Link><i className="fas fa-user-plus"></i> Following</Link></li>
                        </ul>
                    </div>

                        <button onClick={handleLogOut} className="SignOutBtn"><i className="fas fa-sign-out-alt"></i> Sign Out</button>

                    </div>
                    <i onClick={()=>setBars(!Bars)} className={Bars === false ? "fas fa-bars HeaderBars" : "fas fa-times HeaderBars"}></i>
            </header>
            
        </>

    )
}

export default Header;