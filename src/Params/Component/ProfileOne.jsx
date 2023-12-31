import React, { useContext, useEffect, useState } from 'react'
import "./ProfileOne.scss";
import { useNavigate } from 'react-router-dom';
import { BsFillCameraFill } from "react-icons/bs";
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';

const ProfileOne = ({ user }) => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(db, "UpdateProfile", currentUser?.uid ?? "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setImageUrl(data.imageUrl);
            }
        };
        fetchProfileData();
    }, [currentUser?.uid]);

    const [coverImg, setCoverImg] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'UpdateProfile');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCoverImg(newApi);
        });

        return unsubscribe;
    }, []);


    const [im, setIm] = useState(null)

    function on() {
        document.getElementById("ProfileOneImg").style.display = "block";
    }

    function off() {
        document.getElementById("ProfileOneImg").style.display = "none";
    }

    return (
        <>

            <div id="ProfileOneImg" onClick={off}>
                <div id="ProfileOneImg-text">
                    <img src={user.userPhoto} className='ProfileOneImg-photo' alt="" />
                </div>
            </div>

            <div>
                {coverImg.map((item) => {
                    if (item.uid === user.uid) {

                        return (
                            <>
                                <div className="profile-cover-photo-div"
                                    style={{ backgroundImage: `url(${item.CoverPhoto ? item.CoverPhoto : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80'})` }}
                                >
                                    <div className="profile-cover-camera-btn-div-main">
                                        <BsFillCameraFill className='profile-cover-camera-btn' />
                                    </div>
                                    <div className="profile-pic-bg-div">
                                        <div className="profile-pic-div" style={{ backgroundImage: `url(${user && user.userPhoto})` }} onClick={on}></div>
                                    </div>
                                </div>

                            </>
                        )
                    }

                })}


            </div>
        </>
    )
}

export default ProfileOne
