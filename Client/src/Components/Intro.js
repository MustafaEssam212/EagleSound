import React, {useEffect, useState} from 'react';
import '../Styles/Intro.css';
import HeadImg from '../Pics/HeaderImg.png';
import {Link} from 'react-router-dom'
import Icon from '../Pics/icon.png'
import Amr from '../Pics/tmly.jpg'
import Asala from '../Pics/hrof.jpg'
import Emi from '../Pics/emi.png'
import f1 from '../Pics/f1.png'
import {useHistory} from 'react-router-dom'
import {Helmet} from 'react-helmet'

function Intro(){

    const history = useHistory();
    const [SearchInput, setSearchInput] = useState('');

    useEffect(async()=>{
        
        const token = localStorage.getItem('Token');
        if(token){
            history.push(`/Discover`)
        }
    }, [])

    function handleSearch(z){
        z.preventDefault();
        history.push(`/Search?value=${SearchInput}`)
    }

    return(

        <div className='IntroContainer'>

            <Helmet>
                <title>EagleSound</title>
            </Helmet>
            
            <div className='InnerIntroContainer'>

                <header>
                    <img className='img-fluid' src={HeadImg} alt='Header Image'/>
                    <nav>
                        <Link to="/"><img src={Icon} alt='Eagle Sound Icon'/></Link>
                        <ul>
                            <li className='FirstA'><Link to='/SignIn'>Sign in</Link></li>
                            <li className='SecondA'><Link to='/SignUp'>Create account</Link></li>
                        </ul>
                    </nav>
                    <div className='TextDis'>
                        <div className='InnerText'>
                            <h2>Connect on Eagle Sound</h2>
                            <p>Discover, stream, and share a constantly expanding mix of music <br/> from emerging and major artists around the world.</p>
                            <Link className='CenterA' to='/SignUp'>Sign up for free</Link>
                        </div>
                    </div>
                </header>

                <div className='afterHeader'>

                    <div className='SearchOrUpload'>
                        <form onSubmit={handleSearch}>
                            <input type="text"  onChange={(e)=>setSearchInput(e.target.value)} placeholder='Search for tracks or artists'></input>
                            <button type='submit'><i className="fas fa-search"></i></button>
                        </form>
                        <span>or</span>
                        <Link to='/Upload'>Upload your own</Link>
                    </div>

                    <div className='Trend'>
                        <h4>Hear what’s trending for free in the EagleSound community</h4>
                        
                        <div className='Sounds'>

                            <div className='Sound'>
                                <Link className='MainSoundA'>
                                    <i className="fas fa-play" id='PlayIcon'></i>
                                    <img src={Amr}></img>
                                    <Link id='SongName'>عمرو دياب - تملي معاك | Amr Diab - tamly m3ak</Link>
                                    <Link id='Artist'>Amr Diab</Link>
                                </Link>
                            </div>

                            <div className='Sound'>
                                <Link className='MainSoundA'>
                                 <i className="fas fa-play" id='PlayIcon'></i>
                                    <img src={Asala}></img>
                                    <Link id='SongName'>أصالة - قد الحروف | Asala - 2d Al Hrof</Link>
                                    <Link id='Artist'>Asala</Link>
                                </Link>
                            </div>




                        </div>

                    </div>

                </div>


                <div className='thirdPart'>

                    <img src={Emi}></img>
                    
                    <div>
                        <h1>Never stop listening</h1>
                        <div></div>
                        <h2>EagleSound is available on Web, Sign up for free and enjoy listening.</h2>
                    </div>

                </div>


                <div className='fourthPart'>
                    <img className='img-fluid' src={f1}></img>
                </div>

                <div className='fifthPart'>
                    <h2>Thanks for listening. Now join in.</h2>
                    <h4>Save tracks, follow artists and build playlists. All for free.</h4>
                    <Link to='/SignUp' className='fifthCreate'>Create account</Link>

                    <div>
                        <span>already have an account?</span>
                        <Link to='/SignIn'>Sign in</Link>
                    </div>
                    
                </div>
            </div>

        </div>
    )

}

export default Intro;