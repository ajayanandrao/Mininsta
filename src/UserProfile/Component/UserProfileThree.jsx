import React, { useContext, useEffect, useState } from 'react'
import "./UserProfileThree.scss";
import { AuthContext } from "./../../AuthContaxt";
import UserPost from '../Tab/UserPost';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../Firebase';
import UserPhoto from '../Tab/UserPhoto';

const ProfileThree = () => {
    const { currentUser } = useContext(AuthContext);


    function openCity(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const [userPhoto, setUserPhoto] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'UserPostPhoto');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setUserPhoto(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    return (
        <>
            <div className="profileThree-container">


                <div className="tab">
                    <button className="tablinks active" onClick={(event) => openCity(event, 'Post')}>Post</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'About')}>About</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Friend')}>Friend</button>
                    <button className="tablinks" onClick={(event) => openCity(event, 'Photo')}>Photos</button>
                </div>

                <div className='content-div'>

                    <div id="Post" className="tabcontent w3-animate-opacity" style={{ display: "block" }}>

                        {
                            api.map((item) => {
                                if (currentUser && currentUser.uid === item.uid) {
                                    return (
                                        <div key={item.id}>
                                            <UserPost post={item} />
                                        </div>
                                    );
                                }
                                return null;
                            })
                        }

                    </div>

                    <div id="About" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <About /> */}
                        Profile Locked
                    </div>

                    <div id="Friend" style={{ display: "none" }} className="tabcontent w3-animate-opacity">
                        {/* <Friends /> */}
                        Profile Locked
                    </div>

                    <div id="Photo" style={{ display: "none" }} className="tabcontent w3-animate-opacity">

                        <UserPhoto />
                        {/* <div className='photo-grid-center'>
                            <div className='photo-grid'>


                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileThree
