import React, { useEffect, useRef, useState } from 'react'
import "./Notification.scss";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import ReactTimeago from 'react-timeago';
import { Link } from 'react-router-dom';


const Notification = ({ post, postLike }) => {

    const likeList = () => {
        return (
            <>
                {/* {postLike.name} */}
            </>
        )
    };

    const [isLiked, setIsliked] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'likes'),
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
    }, [post.id]);

    const [isComment, setIsComment] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'AllPosts', post.id, 'comments'),
                orderBy('time', "desc")
            ),
            (snapshot) => {
                setIsComment(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            }
        );

        return unsubscribe;
    }, [post.id]);

    const videoRef = useRef(null);
    const [postId, setPostId] = useState("");

    const ViewLikedPost = (id) => {
        setPostId(id);
    };

    return (
        <>
            <div className="notification">
                <div>
                    {isLiked.length > 0 &&
                        <>
                            <Link to={`/notification/${post.id}`}>
                                <div className='notification-inner-div' >
                                    <div>
                                        <img src={isLiked[0].photoUrl} className='notificatioin-profile-img' width={"80px"} alt="" />
                                        {isLiked[0].name}
                                    </div>

                                    <div className="noti-time">
                                        <ReactTimeago
                                            date={isLiked[0].time.toDate()}  // Assuming `isLiked[0].time` is a valid JavaScript Date object
                                            className="feed-time"
                                            formatter={(value, unit, suffix) => {
                                                if (unit === 'second') {
                                                    return 'just now';  // Customize the display for seconds if desired
                                                } else {
                                                    return value + ' ' + unit + ' ago';  // Display the time elapsed in the specified format
                                                }
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className='noti-inner-div-text'>
                                    <div style={{paddingLeft:"45px"}}>
                                        {isLiked.length === 1 ?
                                            <span> like your post</span> :
                                            <>
                                                <span style={{ fontSize: "12px" }}>
                                                    {"and  "}
                                                    <strong>{isLiked.length - 1} {"other"}</strong>
                                                    {" like your post"}
                                                </span>
                                            </>
                                        }
                                    </div>

                                    <div className='noti-post-img-div'>

                                        {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                            <img src={post.img} alt="Uploaded" className="notification-post-img" />
                                        ) : post.img ? (

                                            <div className="video-container">
                                                <video ref={videoRef} className="notification-post-img" >
                                                    <source src={post.img} type="video/mp4" />
                                                </video>

                                            </div>


                                        ) : null}

                                    </div>

                                </div>
                            </Link>
                        </>
                    }

                    {isComment.length > 0 &&
                        <>
                            <div className='notification-inner-div'>
                                <img src={isLiked[0].photoUrl} className='notificatioin-profile-img' width={"80px"} alt="" />
                                <div className='noti-inner-div-text'>
                                    <div className='notification-profile-name'>
                                        {isComment[0].displayName}
                                        <div style={{ fontWeight: "400", fontSize: "11px" }}>
                                            <div className="feed-time">
                                                <ReactTimeago
                                                    date={isComment[0].time.toDate()}  // Assuming `isLiked[0].time` is a valid JavaScript Date object
                                                    className="feed-time"
                                                    formatter={(value, unit, suffix) => {
                                                        if (unit === 'second') {
                                                            return 'just now';  // Customize the display for seconds if desired
                                                        } else {
                                                            return value + ' ' + unit + ' ago';  // Display the time elapsed in the specified format
                                                        }
                                                    }}
                                                />

                                            </div>
                                        </div>
                                    </div>

                                    {isComment.length === 1 ?
                                        <span> comment your post</span> :
                                        <>
                                            <span>
                                                {" and other "}
                                                <strong>{isComment.length - 1}</strong>
                                            </span>
                                        </>
                                    }
                                </div>
                                <div className='noti-post-img-div'>

                                    {post.img && (post.name.includes('.jpg') || post.name.includes('.png')) ? (
                                        <img src={post.photoURL} alt="Uploaded" className="notification-post-img" />
                                    ) : post.img ? (

                                        <div className="video-container">
                                            <video ref={videoRef} className="notification-post-img" >
                                                <source src={post.img} type="video/mp4" />
                                            </video>

                                        </div>


                                    ) : null}

                                </div>
                            </div>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

export default Notification
