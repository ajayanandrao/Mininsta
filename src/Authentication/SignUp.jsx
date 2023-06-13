import React, { useEffect, useState } from 'react'
import "./Signup.scss";
import { Link } from 'react-router-dom';
import { auth, db, storage } from "./../Firebase";
import { addDoc, collection, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { BsFillCameraFill } from "react-icons/bs";

const SignUp = () => {


    const [img, setImg] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPass] = useState("");

    const colRef = collection(db, "users");


    useEffect(() => {
        const unsub = onSnapshot(colRef, (snapshot) => {
            const arry = [];
            (snapshot.forEach((doc) => arry.push({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);


    const submit = async (e) => {
        e.preventDefault();

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password)

            const storageRef = ref(storage, "userPhotos/" + name);
            const uploadTask = uploadBytesResumable(storageRef, img);
            // ------------------

            uploadTask.on('state_changed',
                (snapshot) => {

                },
                (error) => {
                    // Handle unsuccessful uploads
                },
                () => {

                    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                        // console.log('File available at', downloadURL);
                        await updateProfile(res.user, {
                            displayName: name,
                            photoURL: downloadURL,
                        }).then(() => {
                            // Profile updated!
                            // ...
                        }).catch((error) => {
                            // An error occurred
                            // ...
                        });

                        await addDoc(colRef, {
                            uid: res.user.uid,
                            name: name,
                            email: email,
                            password: password,
                            PhotoUrl: downloadURL,
                            // bytime: serverTimestamp(),
                        });

                        const PresenceRef = doc(db, "userPresece", res.user.uid);

                        await setDoc(PresenceRef, {
                            status: "online",
                            uid: res.user.uid,
                            presenceName: name,
                            email: email,
                            photoUrl: downloadURL,
                            presenceTime: new Date()
                        })

                        const PresenceRefOnline = doc(db, "OnlyOnline", res.user.uid);

                        const userData = {
                            status: 'Online',
                            uid: res.user.uid || '',
                            presenceName: res.user.displayName || '',
                            presenceName: name || '',
                            email: email || '',
                            photoUrl: res.user.photoURL || '',
                            presenceTime: new Date()
                            // presenceTime: new Date()
                        };
                        await setDoc(PresenceRefOnline, userData);

                        setDoc(doc(db, "userPostsList", res.user.uid), { messages: [] });

                        const UpdateProfile = doc(db, "UpdateProfile", res.user.uid);

                        await setDoc(UpdateProfile, {
                            name: name,
                            userPhoto: downloadURL,
                            uid: res.user.uid,
                        });

                    });
                }
            );

        } catch (err) {
            alert(err.message);
        }

        setImg(null);
        setName("");
        setEmail("");
        setPass("");
    };



    return (
        <>


            <div className="Signup-form-container signup-div">
                <h3 className='login-title'>LinkupWorld</h3>

                <label htmlFor="photo" >

                    <div className='form-user-img' style={{ backgroundImage: `url("https://habrastorage.org/webt/mq/3y/1h/mq3y1hxg36s7f3g0tojfo7iwp3q.gif")` }}>

                        <img className="img-form" src={img ? URL.createObjectURL(img) :
                            "https://habrastorage.org/webt/mq/3y/1h/mq3y1hxg36s7f3g0tojfo7iwp3q.gif"} alt="" />


                        <BsFillCameraFill className='signup-camera' />
                    </div>


                    {/* <img className="form-user-img" src={img ? URL.createObjectURL(img) :
                        "https://habrastorage.org/webt/mq/3y/1h/mq3y1hxg36s7f3g0tojfo7iwp3q.gif"} alt="" /> */}

                    <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                </label>

                <div className="form-inner-div">
                    <input className="login-input mt-1" type="text"
                        placeholder="Name"
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                    />
                    <input className="login-input mt-1" type="email"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                    />
                    <input className="login-input my-1" type="password"
                        placeholder="Password"
                        onChange={(e) => setPass(e.target.value)}
                        value={password}
                    />
                    <button className="btn-primary-custom w-100 my-5"
                        onClick={submit}>Sign Up</button>



                    <Link to="/" className='link'>
                        <div className='create-new-a'> Already have an account ?</div>
                    </Link>

                </div>
            </div>


            {/* <div className="form-background-container">

                <div className="form-div">
                    <div className='form-title'><h3>SignUP</h3></div>

                    <div className="form-inner-div">

                        <label htmlFor="photo" >
                            <img className="form-user-img" src={img ? URL.createObjectURL(img) : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS1rDH_nWadT1GXFPomdutqV1PUMA8uXIWS2Js5_fq4pJ1lwG16"} alt="" />

                            <input type="file" className="photoinput" id="photo" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
                        </label>

                        <input type="text" className='from-control form-width ' placeholder='Name'
                            onChange={(e) => setName(e.target.value)}
                            value={name}
                        />

                        <input type="email" className='from-control my-4 form-width ' placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                        />

                        <input type="password" className='from-control  form-width ' placeholder='Password'
                            onChange={(e) => setPass(e.target.value)}
                            value={password}
                        />

                        <button type="button" class=" w-100 mt-5 btn-success-custom form-width" onClick={submit}>SignUP</button>

                        <span className='mt-4 forgotten'>Forgotten password?</span>

                        <hr className='w-100 form-width' />
                        <Link to="/" className='link'>
                            <div className='create-new-a'> Already have an account ?</div>
                        </Link>
                    </div>
                </div>
            </div> */}
        </>
    )
}

export default SignUp
