import { CircularProgress, Tabs } from '@mui/material';
import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../Firebase';
import "./NotificationParam.scss";
import { FaPlay } from 'react-icons/fa';
import { BsFillChatDotsFill, BsFillHeartFill } from 'react-icons/bs';
import ReactTimeago from 'react-timeago';

const NotificationPara = () => {
    const { id } = useParams();
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleVideoBtnClick = () => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    };

    const [api, setApiData] = useState(null);
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'AllPosts', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setApiData({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);


    const [comment, setComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', id, 'comments'),
                orderBy('commentTime', "desc")
            ),
            (snapshot) => {
                setComment(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [id]);


    const [isLiked, setIsliked] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', id, 'likes'),
                orderBy('time', "desc")
            ),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [id]);

    function openCity(cityName) {
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(cityName).style.display = "block";
    }

    function TimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }
    function CommentTimeAgoComponent({ timestamp }) {
        return <ReactTimeago date={timestamp} />;
    }

    if (!api) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    return (
        <div className='view-container'>
            <div className='view-noti-profile-div'>
                <img src={api.photoURL} className='View-noti-profile-img' alt="" />
                <div className='view-noti-profile-name'>{api.displayName}</div>
                <div className='view-noti-post-time'>
                    <TimeAgoComponent timestamp={api.bytime && api.bytime.toDate()} />
                </div>
            </div>

            <div className='view-profile-postText'>{api.postText}</div>

            <div className="view-img-wrapper">
                {api.img && (api.name.includes('.jpg') || api.name.includes('.png')) ? (
                    <img src={api.img} alt="Uploaded" className="view-Post-img" />
                ) : api.img ? (

                    <div className="view-video-container">
                        <video ref={videoRef} className="view-post-video" onClick={handleVideoBtnClick}>
                            <source src={api.img} type="video/mp4" />
                        </video>
                        {!isPlaying && (
                            <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                <div className="play-button" >
                                    <FaPlay className='play-button' />
                                </div>
                            </a>
                        )}
                    </div>
                ) : null}
            </div>

            <div>
                <div className="view-tab-block">
                    <button className="w3-bar-item w3-button" onClick={() => openCity('like')}>Like</button>
                    <button className="w3-bar-item w3-button" onClick={() => openCity('comment')}>Comment</button>
                </div >

                <div id="like" className=" w3-animate-bottom city view-container-list">
                    {isLiked.map((like) => {
                        return (
                            <div key={like.id}>
                                <div className='noti-pro-div'>
                                    <img src={like.photoUrl} className='noti-pro-img' alt="" />
                                    <span style={{ textTransform: "capitalize" }}>{like.name}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div id="comment" className=" w3-animate-bottom city view-container-list" style={{ display: "none" }}>

                    {comment.map((item) => {

                        return (
                            <div key={item.id}>
                                <div className='noti-pro-container mb-4'>
                                    <div className='noti-pro-div'>
                                        <img src={item.photoURL} className='noti-pro-img' alt="" />
                                        <span style={{ textTransform: "capitalize", fontWeight: "600" }}>{item.displayName}</span>

                                        <div className='view-noti-post-time'>
                                            <CommentTimeAgoComponent timestamp={item.commentTime && item.commentTime.toDate()} />
                                        </div>

                                    </div>
                                    <span style={{ paddingLeft: "50px" }}>{item.comment}</span>
                                </div>
                            </div>
                        )
                    })}

                </div>
            </div>

        </div>
    )
}

export default NotificationPara
