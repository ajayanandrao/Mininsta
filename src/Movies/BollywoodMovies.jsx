import { collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db, storage } from '../Firebase';
import { CircularProgress } from '@mui/material';
import "./HollywoodMovies.scss";
import { FaPlay } from 'react-icons/fa';
import { ImArrowLeft2 } from 'react-icons/im'
import { getDownloadURL, getMetadata, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const BollywoodMovies = () => {

    const { id } = useParams();
    const [bollywood, Bollywood] = useState(null);
    const [bollywoodData, setBollywoodData] = useState([]);

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
                const userDocRef = doc(db, 'Bollywood', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    Bollywood({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const colRef = collection(db, "Bollywood")

    useEffect(() => {
        const unsub = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setBollywoodData(newbooks);
            })
        };
        return unsub();
    }, []);

    const handleDownload = () => {
        // Logic for downloading the trailer
        const item = bollywoodData.find((item) => item.id === id);
        if (item) {
            const downloadLink = document.createElement('a');
            downloadLink.href = item.trailer;
            downloadLink.download = 'trailer.mp4';
            downloadLink.click();
        }
    };

    const [name, setName] = useState("");
    const [img, setImg] = useState(null);

    const OneUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            saveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                saveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const saveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            one: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const TwoUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            TwosaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                TwosaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const TwosaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            two: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const ThreeUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            ThreesaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                ThreesaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const ThreesaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            three: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const FourUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            FoursaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                FoursaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const FoursaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            four: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    const FiveUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            FivesaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                FivesaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const FivesaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            five: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const SixUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            SixsaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                SixsaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const SixsaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            six: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    const ImgUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BScreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            ImgSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                ImgSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const ImgSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            img: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };


    if (!bollywood) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    const MobileImgUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "Bcreen/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            MobileImgSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                MobileImgSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const MobileImgSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            mobileImg: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };



    const TrailerUpdate = async (id) => {
        if (img) {
            let downloadURL = "";

            if (img) {
                const storageRef = ref(storage, "BTrailer/" + v4());
                const uploadTask = uploadBytesResumable(storageRef, img);

                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        const progress = Math.round(
                            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                        );
                        console.log("Trailer Loading:", progress);
                    },
                    (error) => {
                        console.log("Error uploading img:", error);
                    },
                    async () => {
                        try {
                            await uploadTask;
                            downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            TrailerSaveData(downloadURL, id);
                            console.log("img uploaded successfully");
                        } catch (error) {
                            console.log("Error uploading img:", error);
                        }
                    }
                );
            } else {
                TrailerSaveData(downloadURL, id); // Pass an empty string as the downloadURL
            }
        } else {
            console.log("No img or text entered");
        }
    };

    const TrailerSaveData = async (downloadURL, id) => {
        const movieRef = doc(db, "Bollywood", id);

        await updateDoc(movieRef, {
            trailer: downloadURL ? downloadURL : "",
        }, { merge: true });

        setImg(null);
        setName("");
    };

    return (
        <>
            <div className='main-wrapper'>
                {bollywoodData.map((item) => {
                    if (item.id === id) {
                        const thumbnailImageURL = item.img;

                        return (
                            <div key={item.id} className="hollywood-main-div">
                                <div className="hollywood-video-div">
                                    <video ref={videoRef} className="trailer-video" poster={thumbnailImageURL} onClick={() => handleVideoBtnClick()}>
                                        <source src={item.trailer} type="video/mp4" />
                                    </video>

                                    {!isPlaying && (
                                        <a className="intro-banner-vdo-play-btn pinkBg" onClick={handleVideoBtnClick} target="_blank">
                                            <div className="play-button-div">
                                                <div className="play-btn-div">
                                                    <FaPlay className='play-btn-icon' />
                                                </div>
                                            </div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )
                    }
                })}

                {bollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <>
                                <div style={{ textAlign: "center", textTransform: "uppercase", fontSize: "20px", fontWeight: "600", marginTop: "10px" }}>{item.name}</div>
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


                {bollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <>
                                <div key={item.id}>
                                    <div className='screenShot-grid-div'>
                                        <img src={item.one} className='screenShot-img' alt="" />
                                        <img src={item.two} className='screenShot-img' alt="" />
                                        <img src={item.three} className='screenShot-img' alt="" />
                                        <img src={item.four} className='screenShot-img' alt="" />
                                        <img src={item.five} className='screenShot-img' alt="" />
                                        <img src={item.six} className='screenShot-img' alt="" />
                                    </div>
                                </div>
                            </>
                        )
                    }
                })}



                {/* {bollywoodData.map((item) => {
                    if (item.id === id) {
                        return (
                            <>
                                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
                                <label htmlFor="">
                                    <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                                    image
                                </label>

                                <button className='btn btn-success mt-4' onClick={() => OneUpdate(id)}>One</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => TwoUpdate(id)}>Two</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => ThreeUpdate(id)}>Three</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => FourUpdate(id)}>Four</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => FiveUpdate(id)}>Five</button>
                                <button className='btn btn-success mt-4 ms-2' onClick={() => SixUpdate(id)}>Six</button>

                                <button className='btn btn-primary mt-4 ms-2' onClick={() => ImgUpdate(id)}>Poster</button>

                                <button className='btn btn-primary mt-4 ms-2' onClick={() => MobileImgUpdate(id)}>mobileImg</button>

                                <button className='btn btn-primary mt-4 ms-2' onClick={() => TrailerUpdate(id)}>Trailer</button>

                            </>
                        )
                    }
                })} */}

                <h3 style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button className="btn-success-custom " onClick={handleDownload}>
                        Download
                    </button>
                </h3>

            </div>

            <div className="movie-back-btn">
                <div className="back-arrow-div" onClick={goBack}>
                    <ImArrowLeft2 className="bi bi-arrow-left movie-back-arrow-icon" onClick={handleDownload} />
                </div>
            </div>
        </>
    )
}

export default BollywoodMovies
