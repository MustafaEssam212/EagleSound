import React, {useState, useContext, useEffect} from "react";
import '../Styles/SignUp.css'
import { Link } from "react-router-dom";
import Icon from '../Pics/icona.png'
import axios from "axios";
import { UserContext } from "./User-Context";
import { useHistory } from "react-router-dom";
import {Helmet} from 'react-helmet'

function SignIn(){

  

    const [info, setInfo] = useState({
        email: '',
        password: ''
    })

    const [Error, setError] = useState('');
    const [ErrArr, setErrArr] = useState([]);
    const [Remove, setRemove] = useState([]);
    const UserInfo = useContext(UserContext);
    const history = useHistory();
   

    useEffect(async()=>{
        const id = await JSON.parse(localStorage.getItem('UserStorage'))
        const token = localStorage.getItem('Token');
        if(token){
            history.push(`/Discover`)
        }
    }, [])

    function handleLogin(z){
        z.preventDefault();
        setRemove([]);
        setErrArr([]);
        setError('');
        axios.post(`${process.env.REACT_APP_API}v1/login`, {info})
        .then(res=>{
            if(res.data.message){
                setError(res.data.message)
            }
            else if(res.data.token){
                
                UserInfo.setUser(res.data.user)
                localStorage.setItem('UserStorage', JSON.stringify(res.data.user))
                localStorage.setItem('Token', res.data.token)
                history.push(`/Discover`)
            }
            else{
                setErrArr(res.data)
                
            }
        })
    }


   
    return(

        <div className="SignInContainer">

            <Helmet>
                <title>Sign in | EagleSound</title>
            </Helmet>
            
                <header className="SignInHeader">
                   <Link to="/"><img src={Icon} title="EagleSound" alt="EagleSound"></img></Link>
                </header>


                <div className="SignIn">

                    

                    <form onSubmit={handleLogin} className="SignInForm  img-fluid">
                        <h5>Welcome Back To EagleSound</h5>
                        <img src={Icon} className="SignInIcon"></img>

                        <input onChange={(e)=> setInfo({...info, email: e.target.value})} type="email" placeholder="Email"></input>
                        <input onChange={(e)=> setInfo({...info, password: e.target.value})} type="password" placeholder="Password"></input>
                        <button type="submit">Log In</button>
                    </form>
                    <div className="SignUpLink">
                        <Link to="/SignUp">Do not have an account yet? click here</Link>
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

                    {
                        ErrArr.length === 0 ? <span></span> : <div className="BigPop">
                        
                        {
                            ErrArr.map((e, key)=>{
                              return  <div className={Remove.includes(key) ? "Nothing" : "ErrorPop"}>
                                    <i className="fas fa-times-circle PopI"></i>
                                    <div>
                                        <p className="PopTitle">Error!</p>
                                        <p className="PopMess">{e.msg}</p>
                                    </div>
                                    <i onClick={()=>setRemove([...Remove, key])} className="fas fa-times PopClose"></i>
                                </div>
                            })
                        }

                    </div>
                    }

                </div>

        </div>

    )
}

export default SignIn;