import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../Firebase';
import { CircularProgress } from '@mui/material';
import "./HollywoodMovies.scss";
import { FaPlay } from 'react-icons/fa';
import { ImArrowLeft2 } from 'react-icons/im'

const HollywoodMovies = () => {
    const { id } = useParams();
    const [hollywood, Hollywood] = useState(null);
    const [hollywoodData, setHollywoodData] = useState([]);

    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    };

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
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'Hollywood', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    Hollywood({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const colRef = collection(db, "Hollywood")

    useEffect(() => {
        const unsub = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setHollywoodData(newbooks);
            })
        };
        return unsub();
    }, []);



    if (!hollywood) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    return (
        <>
            <div className='main-wrapper'>
                {hollywoodData.map((item) => {
                    if (item.id === id) {
                        const thumbnailImageURL = item.img;

                        return (
                            <>
                                <div className="hollywood-main-div">
                                    <div className="hollywood-video-div">
                                        <video ref={videoRef} className="trailer-video" poster={thumbnailImageURL} onClick={() => handleVideoBtnClick()}>
                                            <source src={item.trailer} type="video/mp4" />
                                        </video>

                                        {!isPlaying && (
                                            <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                                <div className="play-button-div" >
                                                    <div className="play-btn-div">
                                                        <FaPlay className='play-btn-icon' />
                                                    </div>
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </>
                        )
                    }
                })}

                <div className="movie-desc-div">
                    <span className='movie-desc-language'>Language:-
                        <span className='language-one ms-2' >Hindi</span>
                        <span className='language-one ms-2'>English</span>
                        <span className='language-one ms-2'>(Dual Audio)</span>
                    </span>
                </div>

                <h4 style={{ color: "#045FB4", fontWeight: "600", textAlign: "center" }}>ScreenShots</h4>

                <div className='screenShot-grid-div'>
                    {hollywoodData.map((item) => {
                        return (
                            <>
                                <img src={item.img} className='screenShot-img' alt="" />
                            </>
                        )
                    })}
                </div>

                <h3 style={{ marginTop: "20px", textAlign: "center" }}>
                    <button className='btn btn-success-custom'>Download</button>
                </h3>

            </div>

            <div className="movie-back-btn">
                <div className="back-arrow-div" onClick={goBack}>
                    <ImArrowLeft2 class="bi bi-arrow-left movie-back-arrow-icon" />
                    {/* <i class="bi bi-arrow-left movie-back-arrow-icon"></i> */}
                </div>
            </div>

            {/* <div className='singup-footer-bottom'>Copyright © Ajay Anandaro 2023. </div> */}
        </>
    )
}

export default HollywoodMovies
