import React, { useContext, useEffect, useState } from 'react'
import "./Login.scss"
import { Link, useNavigate } from 'react-router-dom'
import SignUp from './SignUp'
import { AuthContext } from '../AuthContaxt';
import { auth, db } from '../Firebase';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, TextField } from '@mui/material';



const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const nav = useNavigate();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {

                nav("/home")
                // return (<a href="https://google.com"></a>)
            } else {
                nav("/")
            }
        })
    }, []);

    const login = (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;

                const PresenceRef = doc(db, "userPresece", user.uid);

                await updateDoc(PresenceRef, {
                    status: "online",
                });


                const PresenceRefOnline = doc(db, "OnlyOnline", user.uid);

                const userData = {
                    status: 'Online',
                    uid: user.uid,
                    presenceName: user.displayName,
                    email: email,
                    photoUrl: user.photoURL,
                    presenceTime: new Date()
                    // presenceTime: new Date()
                };

                await setDoc(PresenceRefOnline, userData);

                // console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                if (errorCode == "auth/wrong-password") {
                    document.getElementById("error").style.display = "flex";
                    document.getElementById("error").innerHTML = "Wrong Password";
                }
                if (errorCode == "auth/user-not-found") {
                    function alert() {

                        document.getElementById("error").style.display = "flex";
                        document.getElementById("error").innerHTML = "User not found";
                    }
                    alert();
                }
                if (errorCode == "auth/invalid-email") {
                    document.getElementById("error").style.display = "flex";
                    document.getElementById("error").innerHTML = "invalid email address";
                }
            });

        setEmail("");
        setPass("");
    };

    return (
        <>

            <div className="login-form-container">
                <h3 className='login-title'>Mininsta</h3>
                <div className="form-inner-div">
                    <input className="login-input mt-3" type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input className="login-input my-3" type="password"
                        placeholder="Password"
                        onChange={(e) => setPass(e.target.value)}
                        value={password}
                    />
                    <button className="btn-primary-custom w-100 my-4" onClick={login}>Login</button>
                    <span className='forgot-text'>Forgotten password?</span>
                    <Link to="signUp/" className='link'>
                        <button className="btn-success-outline my-4">Create New Account</button>
                    </Link>
                </div>
                <div className='footer-bottom'>Copyright © Ajay Anandaro 2023. </div>
            </div>







            {/* <div className="form-background-container">
                <div className="form-div">
                    <div className='form-title'><h3>Login</h3></div>

                    <div></div>

                </div>
            </div> */}
        </>
    )
}

export default Login
