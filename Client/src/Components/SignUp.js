import React, {useState, useEffect} from "react";
import '../Styles/SignUp.css'
import Icon from '../Pics/icona.png'
import { Link } from "react-router-dom";
import axios from 'axios';
import {useHistory} from 'react-router-dom'
import {Helmet} from 'react-helmet'

function SignUp(){


    
    useEffect(async()=>{
        const id = await JSON.parse(localStorage.getItem('UserStorage'))
        const token = localStorage.getItem('Token');
        if(token){
            history.push(`/Discover`)
        }
    }, [])

    const [info, setInfo] = useState({
        email: '',
        username: '',
        password: '',
    })

    const [confirmpass, setConfirmPass] = useState('');
    const [ConfirmErr, setConfirmErr] = useState(false);
    const [Errors, setErrors] = useState([]);
    const [Remove, setRemove] = useState([]);
    const [Success, setSuccess] = useState('');   
    const [ErrMess, setErrMess] = useState('');
    const history = useHistory();


    function handleRegister(z){
        z.preventDefault();
        setRemove([])
        setErrors([])
        if(confirmpass === info.password){
            axios.post(`${process.env.REACT_APP_API}v1/register`, {info})
            .then(res=>{
                console.log(res.data)
                if(res.data.message === 'This email already exist'){    
                    setErrMess(res.data.message)
                }else if(res.data.message === "Register successful"){
                    setSuccess(res.data.message)
                }else{
                    setErrors(res.data)
                }
            })
        }else{
            setConfirmErr(true)
        }

       
    }


    
    return(

        <div className="SignUpContainer">

            <Helmet>
                <title>Sign up | EagleSound</title>
            </Helmet>

            <header className="SignUpHeader">
                <Link to="/"><img src={Icon} title="EagleSound" alt="EagleSound"></img></Link>
                
            </header>
                <div className="SignUp ">
                    <form onSubmit={handleRegister} className="SignUpForm  img-fluid">
                        <h5>Join EagleSound Community</h5>
                        
                        <img className="SignUpIcon" src={Icon}></img>
                        <input onChange={(e)=>setInfo({...info, username: e.target.value})} type='text' placeholder="Username"></input>
                        <input onChange={(e)=>setInfo({...info, email: e.target.value})} type='email' placeholder="Email"></input>
                        <input onChange={(e)=>setInfo({...info, password: e.target.value})} type='password' placeholder="Password"></input>
                        <input onChange={(e)=>setConfirmPass(e.target.value)} type='password' placeholder="Confirm Password"></input>
                        <button type="submit">Register</button>            
                    </form> 
                    <Link className="SignUpLink" to="/SignIn">Already have an account? click here</Link>
                </div>

                <div className="Errors">

                        {
                            Success === '' ? <span></span> : <div className="BigPop">
                            
                            <div className="SuccessPop">
                            <i className="fas fa-check-circle PopI"></i>
                                <div>
                                    <p className="PopTitle">Success!</p>
                                    <p className="PopMess">{Success} <Link to="/SignIn">click here to login</Link></p>
                                </div>
                                <i onClick={()=>setSuccess('')} className="fas fa-times PopClose"></i>
                            </div>

                        </div>
                        }

                        {
                            ErrMess === '' ? <span></span> : <div className="BigPop">
                            
                            <div className="ErrorPop">
                            <i className="fas fa-times-circle PopI"></i>
                                <div>
                                    <p className="PopTitle">Success!</p>
                                    <p className="PopMess">{ErrMess}</p>
                                </div>
                                <i onClick={()=>setErrMess('')} className="fas fa-times PopClose"></i>
                            </div>

                        </div>
                        }

                    <div className="BigPop">
                        
                        <div className={ConfirmErr === false ? "Nothing" : "ErrorPop"}>
                            <i className="fas fa-times-circle PopI"></i>
                            <div>
                                <p className="PopTitle">Error!</p>
                                <p className="PopMess">Password does not match</p>
                            </div>
                            <i onClick={()=>setConfirmErr(false)} className="fas fa-times PopClose"></i>
                        </div>

                    </div>
                    
                    {
                        Errors.length === 0 ? <span></span> : <div className="BigPop">
                            {
                                Errors.map((e, key)=>{
                                    return <div className={Remove.includes(key) ? "Nothing" : "ErrorPop"}>
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

export default SignUp;