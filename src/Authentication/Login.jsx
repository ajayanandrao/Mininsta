import React, { useContext, useEffect, useState } from 'react'
import "./Login.scss"
import { Link, useNavigate } from 'react-router-dom'
import SignUp from './SignUp'
import { AuthContext } from '../AuthContaxt';
import { auth, db } from '../Firebase';
import { collection, doc, orderBy, query, setDoc, updateDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Box, TextField } from '@mui/material';
import { useCollectionData } from 'react-firebase-hooks/firestore';



const Login = () => {
    const { currentUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const [loading, setLoading] = useState(true);

    const nav = useNavigate();


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Simulating an asynchronous operation with setTimeout
                setLoading(true);
                setTimeout(() => {
                    nav("/home");
                    setLoading(false);
                }, 1000);
            } else {
                nav("/");
                setLoading(false);
            }
        });

        return () => {
            unsubscribe(); // Cleanup the subscription when the component unmounts
        };
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
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "Wrong Password";
                }
                if (errorCode == "auth/user-not-found") {
                    function alert() {

                        document.getElementById("error-alert").style.display = "flex";
                        document.getElementById("error-alert").innerHTML = "User not found";
                    }
                    alert();
                }
                if (errorCode == "auth/invalid-email") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "invalid email address";
                }
                if (errorCode == "auth/network-request-failed") {
                    document.getElementById("error-alert").style.display = "flex";
                    document.getElementById("error-alert").innerHTML = "Check your internet connection";
                }
            });

        setEmail("");
        setPass("");
    };


    return (
        <>

            {loading ? (
                <div className='login-wellcome-div'>
                    <div>{currentUser && <>Wellcome</>}</div>
                    {/* <div className='wellcome-text'>
                        <h5 className='wellcome-text'>{currentUser && currentUser.displayName}</h5>
                    </div> */}
                </div>
            ) : (


                <div className='login-form-container'>
                    <div className="login-form-container w3-animate-left w3-animate-opacity">
                        <h3 className='login-title'>Chat App</h3>


                        <div className="form-inner-div">
                            <input className="login-input mt-3" type="email"
                                placeholder="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <input className="login-input my-3" type="password"
                                placeholder="Password"
                                onChange={(e) => setPass(e.target.value)}
                                value={password}
                            />

                            <div class="" id="error-alert"></div>

                            <button className="btn-primary-custom w-100 my-4" onClick={login}>Login</button>

                            {/* <span className='forgot-text'>Forgotten password?</span> */}
                            <Link to="/forgotPassword" className='forgot-text'>Forgotten password?</Link>

                            <Link to="signUp/" className='link'>
                                <button className="btn-success-outline my-4">Create New Account</button>
                            </Link>
                        </div>
                        <div className='footer-bottom'>Copyright © Ajay Anandaro 2023. </div>
                    </div>
                </div>

            )}

        </>
    )
}

export default Login
