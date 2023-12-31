import React, { useContext, useEffect, useRef, useState } from 'react'
import "./UserProfileOne.scss";
import { useNavigate } from 'react-router-dom';
import { BsFillCameraFill } from "react-icons/bs";
import { AuthContext } from "./../../AuthContaxt";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { auth, db, storage } from '../../Firebase';
import { addDoc, collection, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { CircularProgress, LinearProgress } from '@mui/material';
import { IoIosCloseCircle, IoMdClose } from 'react-icons/io';
import imageCompression from 'image-compressor';


const ProfileOne = () => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const fileInput = useRef(null);

    const [loading, setLoading] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [img, setImg] = useState(null);


    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setProfilePhoto(file);
        handleUpload(file);
        setImg(file);
    };


    const profileDataRef = doc(db, "UpdateProfile", currentUser?.uid ?? 'default');

    const compressImageProfile = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };


    const handleUpload = async (file) => {
        setLoading(true);

        if (file) {
            if (file.type.startsWith('image/')) {

                try {
                    // Create a Firebase Storage reference to the NewProfilePhotos folder with a unique name

                    const compressedImgBlob = await compressImageProfile(file, 800);

                    const timestamp = new Date().getTime();
                    const storageRef = ref(storage, `NewProfilePhotos/${timestamp}-${file.name}`);

                    // Upload the selected image file to Firebase Storage
                    await uploadBytes(storageRef, compressedImgBlob);
                    // Get download URL for uploaded file
                    const downloadURL = await getDownloadURL(storageRef);

                    // Update user profile with new photoURL
                    await updateProfile(auth.currentUser, { photoURL: downloadURL });

                    await setDoc(profileDataRef, {
                        userPhoto: downloadURL,
                    }, { merge: true });

                    const userPostPhotoRef = collection(db, "UserPostPhoto");

                    await addDoc(userPostPhotoRef, {
                        name: img ? img.name : '',
                        img: img ? downloadURL : '', // Only use the downloadURL if a img was uploaded
                        uid: currentUser.uid,
                        photoURL: currentUser.photoURL,
                        displayName: currentUser.displayName,
                        bytime: serverTimestamp(), // Use the server timestamp here
                    });


                    window.location.reload();

                    console.log('Profile photo updated successfully!');
                } catch (error) {
                    console.error('Error updating profile photo:', error);
                }

            }
        }

        setLoading(false);

    };

    //  Cover Photo

    function on() {
        document.getElementById("Cover").style.display = "block";
    }

    function off() {
        setCover(null);
        document.getElementById("Cover").style.display = "none";
    }
    const [cover, setCover] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    // Inside the useEffect section of the ProfileOne component
    useEffect(() => {
        const fetchProfileData = async () => {
            const docRef = doc(db, "UpdateProfile", currentUser?.uid ?? "default");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Check if the browser supports WebP format
                const supportsWebP = (new Image()).srcset.includes('webp');
                setImageUrl(supportsWebP && data.webpImageUrl ? data.webpImageUrl : data.imageUrl);
            }
        };
        fetchProfileData();
    }, [currentUser?.uid]);


    const [coverImg, setCoverImg] = useState([]);
    const [loadingCoverData, setLoadingCoverData] = useState(true);


    useEffect(() => {
        const colRef = collection(db, 'UpdateProfile');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setCoverImg(newApi);
            setLoadingCoverData(false);
        });

        return unsubscribe;
    }, []);



    const compressImage = async (imageFile, maxWidth) => {
        return new Promise((resolve, reject) => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                const aspectRatio = img.width / img.height;
                const newWidth = Math.min(maxWidth, img.width);
                const newHeight = newWidth / aspectRatio;

                canvas.width = newWidth;
                canvas.height = newHeight;

                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(resolve, 'image/jpeg', 0.7); // Adjust the compression quality if needed
            };

            img.onerror = reject;

            img.src = URL.createObjectURL(imageFile);
        });
    };

    const CoverUpload = async () => {
        setLoading(true);

        if (cover) {
            if (cover.type.startsWith('image/')) {
                try {
                    const compressedImgBlob = await compressImage(cover, 800);

                    const imageRef = ref(storage, `images/${cover.name}`);
                    uploadBytes(imageRef, compressedImgBlob)
                        .then(async (snapshot) => {
                            console.log("Uploaded image successfully");
                            const url = await getDownloadURL(imageRef);
                            setImageUrl(url);

                            await setDoc(profileDataRef, {
                                CoverPhoto: url
                            }, { merge: true });

                            console.log("Image URL added to Firestore");
                        })
                        .catch((error) => {
                            console.error("Error uploading image", error);
                        });
                } catch (error) {
                    console.log("Error compressing Cover Image:", error);
                }
            }
        }

        setLoading(false);
        off();
    };




    return (
        <>

            <div>

                {loadingCoverData ? (

                    <div className='placeholder-glow loading-profile-cover-photo-div'>
                        <div className="placeholder placeholder-dimension"></div>
                    </div>

                ) : (

                    <>
                        {coverImg.map((item) => {
                            if (item.uid === currentUser.uid) {
                                return (
                                    <>
                                        <div className="profile-cover-photo-div"
                                            style={{ backgroundImage: `url(${item.CoverPhoto ? item.CoverPhoto : 'https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1158&q=80'})` }}
                                        >
                                            <div className="profile-cover-camera-btn-div" onClick={on}>
                                                <BsFillCameraFill className='profile-cover-camera-btn' />
                                            </div>


                                            <div id="Cover">
                                                <div id="CoverCard">

                                                    <div className="Cover-card-bg">
                                                        <div className="cover-card-inner-div">
                                                            <div className='cover-close-div'>
                                                                <IoMdClose onClick={off} style={{ fontSize: "24px" }} />
                                                            </div>

                                                            {loading ? (<LinearProgress />) : ""}

                                                            <label htmlFor="cover-img">
                                                                <img className='Cover-img' src={cover ? URL.createObjectURL(cover) : (imageUrl ? imageUrl : item.CoverPhoto)} alt="" />
                                                            </label>

                                                            <input type="file" id='cover-img' onChange={(e) => setCover(e.target.files[0])} style={{ display: "none" }} />

                                                            <div className='upload-btn-div'>
                                                                <button className="btn-success-custom" onClick={CoverUpload}>Save</button>
                                                            </div>

                                                        </div>
                                                    </div>

                                                </div>
                                            </div>


                                            <div className="profile-pic-bg-div">

                                                <div className="profile-pic-div" style={{ backgroundImage: `url(${currentUser && currentUser.photoURL})` }}>

                                                    {loading ? (<CircularProgress style={{ fontSize: "16px" }} />) : ""}

                                                    <div className="photo-edit-div">
                                                        <label htmlFor="profile-img">
                                                            <BsFillCameraFill className='photo-camera' />
                                                        </label>

                                                        <input type="button" id='profile-img' value="Select Image" style={{ display: "none" }} onClick={() => fileInput.current.click()} />

                                                        <input type="file" ref={fileInput} style={{ display: 'none' }} onChange={handleImageUpload} accept="image/*" />
                                                    </div>
                                                </div>
                                            </div>

                                        </div>


                                    </>
                                )
                            }
                        })}
                    </>

                )
                }


            </div>

        </>
    )
}

export default ProfileOne




// const CoverUpload = () => {
//     setLoading(true);
//     const imageRef = ref(storage, `images/${cover.name}`);
//     uploadBytes(imageRef, cover)
//         .then((snapshot) => {
//             console.log("Uploaded image successfully");
//             getDownloadURL(imageRef).then((url) => {
//                 setImageUrl(url);
//                 setDoc(profileDataRef, {
//                     CoverPhoto: url
//                 },
//                     { merge: true })
//                     .then(() => {
//                         console.log("Image URL added to Firestore");
//                         setLoading(false);
//                         off();
//                     })
//                     .catch((error) => {
//                         console.error("Error adding image URL to Firestore:", error);
//                         setLoading(false);
//                     });
//             });
//         })
//         .catch((error) => {
//             console.error("Error uploading image", error);
//             setLoading(false);
//         });
// };