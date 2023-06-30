import React, { useEffect, useState, useRef } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';

import './Reals.scss';
import { FaPlay, FaCommentAlt } from 'react-icons/fa';
import { BsFillArrowDownCircleFill, BsFillArrowUpCircleFill, BsFillHeartFill } from 'react-icons/bs';

const VideoItem = ({ post }) => {
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

    useEffect(() => {
        const handleScroll = () => {
            const video = videoRef.current;
            const rect = video.getBoundingClientRect();
            const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
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
    };

    const scrollToNext = (id) => {
        const element = document.getElementById(`section2-${id}`);
        if (element && element.nextElementSibling) {
            element.nextElementSibling.scrollIntoView({ behavior: 'smooth' });
        }
    };


    return (
        <div className="reel-video-container" id={`section2-${post.id}`}>
            <video ref={videoRef} className="reel-video" onClick={handleVideoBtnClick}>
                <source src={post.img} type="video/mp4" />
            </video>
            <div className="reel-side-mainu" onClick={handleVideoBtnClick}>
                <div className="reel-mainu">



                    <div className="reel-mainu-icon-div">
                        <BsFillHeartFill className='reel-mainu-icon' />
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
                <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
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
