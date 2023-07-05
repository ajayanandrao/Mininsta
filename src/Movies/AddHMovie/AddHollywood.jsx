import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import "./AddHollywood.scss";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db, storage } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4 } from 'uuid';

const AddHollywood = () => {

    const { id } = useParams();
    const [movieCat, MovieCat] = useState(null);
    const [name, setName] = useState("");
    const [subName, setSubName] = useState("");
    const [img, setImg] = useState(null);
    const [trailerVid, setTrailerVid] = useState(null);


    const [screenShotOne, setScreenShotOne] = useState(null);
    const [screenShotTwo, setScreenShotTwo] = useState(null);
    const [screenShotThree, setScreenShotThree] = useState(null);
    const [screenShotFour, setScreenShotFour] = useState(null);



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'MovieCat', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    MovieCat({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!movieCat) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    const Save = async () => {
        const movieRef = collection(db, "Hollywood");

        try {
            const storageRef = ref(storage, "Hollywood/" + name);
            const TrailerRef = ref(storage, "Trailer/" + name);

            // Upload image file
            const imgUploadTask = uploadBytesResumable(storageRef, img);
            imgUploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Loading:", progress);
                    if (progress == 100) {
                        console.log("sucessfully uploaded");
                    }

                },
            );
            const ScreenShotUploadTaskOne = uploadBytesResumable(storageRef, screenShotOne);
            imgUploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Loading:", progress);
                    if (progress == 100) {
                        console.log("sucessfully uploaded");
                    }

                },
            );
            const ScreenShotUploadTaskTwo = uploadBytesResumable(storageRef, screenShotTwo);
            imgUploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Loading:", progress);
                    if (progress == 100) {
                        console.log("sucessfully uploaded");
                    }

                },
            );
            const ScreenShotUploadTaskThree = uploadBytesResumable(storageRef, screenShotThree);
            imgUploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Loading:", progress);
                    if (progress == 100) {
                        console.log("sucessfully uploaded");
                    }

                },
            );
            const ScreenShotUploadTaskFour = uploadBytesResumable(storageRef, screenShotFour);
            imgUploadTask.on('state_changed',
                (snapshot) => {
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    );
                    console.log("Loading:", progress);
                    if (progress == 100) {
                        console.log("sucessfully uploaded");
                    }

                },
            );

            // Upload trailer video file
            const trailerVidUploadTask = uploadBytesResumable(TrailerRef, trailerVid);
            trailerVidUploadTask.on('state_changed', (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                console.log("Loading:", progress);
                if (progress == 100) {
                    console.log("sucessfully uploaded");
                }

            },);

            Promise.all([
                getDownloadURL(imgUploadTask.snapshot.ref),
                getDownloadURL(trailerVidUploadTask.snapshot.ref),

                getDownloadURL(ScreenShotUploadTaskOne.snapshot.ref),
                getDownloadURL(ScreenShotUploadTaskTwo.snapshot.ref),
                getDownloadURL(ScreenShotUploadTaskThree.snapshot.ref),
                getDownloadURL(ScreenShotUploadTaskFour.snapshot.ref),

            ]).then(async ([imgDownloadURL, trailerVidDownloadURL, OneDownloadURL, TwoDownloadURL, ThreeDownloadURL, FourDownloadURL]) => {
                await addDoc(movieRef, {
                    name: name,
                    subName: subName,
                    img: imgDownloadURL,
                    trailer: trailerVidDownloadURL,

                    one: OneDownloadURL,
                    two: TwoDownloadURL,
                    three: ThreeDownloadURL,
                    four: FourDownloadURL,

                    uid: v4()
                });
            });
        } catch (error) {
            console.log("error:", error);
        }

        setName("");
        setSubName("");
        setImg(null);
        setTrailerVid(null);
    };

    return (
        <>
            <div className='add-holy-container'>
                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} value={name} />
                <input type="text" className='my-4' placeholder='sub name' onChange={(e) => setSubName(e.target.value)} value={subName} />

                <label htmlFor="">
                    <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                    image
                </label>

                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setTrailerVid(e.target.files[0])} />
                    Video
                </label>

                <h3 style={{ textAlign: "center" }}>ScreenShot</h3>


                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setScreenShotOne(e.target.files[0])} />
                    one
                </label>
                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setScreenShotTwo(e.target.files[0])} />
                    two
                </label>
                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setScreenShotThree(e.target.files[0])} />
                    three
                </label>
                <label htmlFor="" className='mt-3'>
                    <input type="file" placeholder='trailer' onChange={(e) => setScreenShotFour(e.target.files[0])} />
                    four
                </label>


                <button className='btn btn-info my-4' onClick={Save}>save</button>
            </div>
        </>
    )
}

export default AddHollywood
