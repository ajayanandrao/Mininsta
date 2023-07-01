import React, { useEffect, useState, useRef, useContext } from 'react';
import { collection, deleteDoc, doc, getDoc, onSnapshot, orderBy, query, setDoc } from 'firebase/firestore';
import { db } from '../Firebase';

import './Reals.scss';
import { FaPlay, FaCommentAlt } from 'react-icons/fa';
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsFillHeartFill } from 'react-icons/bs';
import { AuthContext } from '../AuthContaxt';

const VideoItem = ({ post }) => {
    const { currentUser } = useContext(AuthContext);
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);


    const handleVideoBtnClick = (id) => {
        const video = videoRef.current;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            const video = videoRef.current;
            const rect = video.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom < window.innerHeight;
            if (isInViewport) {
                if (video.paused) {
                    video.play();
                    setIsPlaying(true);
                }
            } else {
                if (!video.paused) {
                    video.pause();
                    setIsPlaying(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);


    const scrollToPreview = (id) => {
        const element = document.getElementById(`section2-${id}`);
        if (element && element.previousElementSibling) {
            element.previousElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    };

    const scrollToNext = (id) => {
        const element = document.getElementById(`section2-${id}`);
        if (element && element.nextElementSibling) {
            element.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    };

    const [liked, setLiked] = useState(false);
    const [like, setLike] = useState([]);
    const [isliked, setIsliked] = useState([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(
            query(collection(db, 'UserPostPhoto', post.id, 'likes')),
            (snapshot) => {
                setIsliked(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
                // Log the uid property of each document
            }
        );

        return unsubscribe;
    }, [post.id]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "UserPostPhoto", post.id, "likes"),
            (snapshot) => setLike(snapshot.docs)
        );
        return () => {
            unsub();
        };
    }, [post.id]);

    useEffect(() => {
        setLiked(like.findIndex((like) => like.id === currentUser?.uid) !== -1);
    }, [like, currentUser.uid]);

    const HandleLike = async (id) => {
        if (currentUser && currentUser.uid) {
            const likeRef = doc(db, "UserPostPhoto", id, "likes", currentUser.uid);
            const likeDoc = await getDoc(likeRef);
            console.log(id);
            console.log(currentUser.uid);

            if (likeDoc.exists()) {
                await deleteDoc(likeRef);
            } else {
                await setDoc(likeRef, {
                    userUid: currentUser.uid,
                    name: currentUser.displayName
                });
            }
        }
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'block') {
            x.style.display = 'none';
        }
    }

    const ViewLikes = (id) => {
        const x = document.getElementById(`viewLike-${id}`);
        if (x.style.display == 'none') {
            x.style.display = 'block';
        } else {
            x.style.display = 'none';
        }
    };

    return (
        <div className="reel-video-container" id={`section2-${post.id}`}>
            <video ref={videoRef} className="reel-video" onClick={() => handleVideoBtnClick(post.id)}>
                <source src={post.img} type="video/mp4" />
            </video>

            <div className="reel-like-div" style={{ fontSize: "12px", display: "none" }} id={`viewLike-${post.id}`}>
                {isliked.map((item) => {
                    return (
                        <>
                            <div className='reel-like-inner-div'>
                                {item.name}
                            </div>
                        </>
                    )
                })}
            </div>

            <div className="reel-side-mainu" >
                <div className="reel-mainu">

                    <div className="reel-mainu-icon-div">
                        <div className='like-count' onClick={() => ViewLikes(post.id)}>{isliked.length}</div>
                        {liked ? <BsFillHeartFill color='#FF0040' className='reel-mainu-icon' onClick={() => HandleLike(post.id)} /> :
                            <BsFillHeartFill className='reel-mainu-icon' onClick={() => HandleLike(post.id)} />
                        }
                    </div>
                    <div className="reel-mainu-icon-div">
                        <BsFillArrowUpCircleFill className='reel-mainu-icon' onClick={() => scrollToPreview(post.id)} />
                    </div>
                    <div className="reel-mainu-icon-div">
                        <BsFillArrowDownCircleFill className='reel-mainu-icon' onClick={() => scrollToNext(post.id)} />
                    </div>
                </div>
            </div>
            {!isPlaying && (
                <a className="intro-banner-vdo-play-btn pinkBg" onClick={() => handleVideoBtnClick(post.id)} target="_blank">
                    <div className="play-button">
                        <FaPlay className="play-button" />
                    </div>
                </a>
            )}

        </div>
    );
};

const Reals = () => {
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

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };

    const isVideo = (filename) => {
        const videoExtensions = ['mp4'];
        const extension = getFileExtension(filename);
        return videoExtensions.includes(extension);
    };



    const VideoData = userPhoto.map((post) => {
        return (
            <React.Fragment key={post.id}>
                {post.img && isVideo(post.name) && <VideoItem post={post} />}
            </React.Fragment>
        );
    });

    return (
        <>
            <div className="reel-position-div">
                <div className="reel-scroll-div">
                    {VideoData}
                </div>
            </div>
        </>
    );
};

{/* {post.img && isVideo(post.name) && <VideoItem post={post} />} */ }
export default Reals;
