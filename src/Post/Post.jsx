import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Post.scss";
import photo from "./../Image/img/photo.png";
import smile from "./../Image/img/emoji.png";
import video from "./../Image/img/v.png";
import { AuthContext } from '../AuthContaxt';
import { Timestamp, addDoc, arrayUnion, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, storage } from '../Firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { v4, uuidv4 } from "uuid";

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

import { FaPlay } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Post = () => {
  const { currentUser } = useContext(AuthContext);
  const colRef = collection(db, "AllPosts");
  const q = query(colRef, orderBy("bytime", "desc"));

  const [postText, setPostText] = useState("");
  const [img, setImg] = useState(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showImg, setShowImg] = useState(false);


  const handleUpload = async () => {
    setShowEmoji(false);
    setPostText("");
    setImg(null);

    if (img || postText) {
      let downloadURL = "";

      if (img) {

        const storageRef = ref(storage, "PostVideo/" + v4());
        const uploadTask = uploadBytesResumable(storageRef, img);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            if (progress < 100) {
              document.getElementById("p1").style.display = "block";
            } else {
              document.getElementById("p1").style.display = "none";
            }
            console.log("Loading:", progress);
          },
          (error) => {
            console.log("Error uploading img:", error);
          },
          async () => {
            try {
              await uploadTask;
              downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              saveData(downloadURL);

              console.log('img uploaded successfully');
            } catch (error) {
              console.log('Error uploading img:', error);
            }
          }
        );
      } else {
        saveData(downloadURL); // Pass an empty string as the downloadURL
      }
    } else {
      console.log('No img or text entered');
    }
    // setPostText("");
  };

  const saveData = async (downloadURL) => {
    const allPostsColRef = collection(db, 'AllPosts');
    const userPostsListRef = doc(db, 'userPostsList', currentUser.uid);
    const userPostPhotoRef = collection(db, "UserPostPhoto");

    await addDoc(allPostsColRef, {
      name: img ? img.name : '',
      img: img ? downloadURL : '', // Only use the downloadURL if a img was uploaded
      uid: currentUser.uid,
      photoURL: currentUser.photoURL,
      displayName: currentUser.displayName,
      postText: postText,
      bytime: serverTimestamp(), // Use the server timestamp here
    });

    await addDoc(userPostPhotoRef, {
      name: img ? img.name : '',
      img: img ? downloadURL : '', // Only use the downloadURL if a img was uploaded
      uid: currentUser.uid,
      photoURL: currentUser.photoURL,
      displayName: currentUser.displayName,
      postText: postText,
      bytime: serverTimestamp(), // Use the server timestamp here
    });

    await updateDoc(userPostsListRef, {
      messages: arrayUnion({
        id: v4(),
        uid: currentUser.uid,
        photoURL: currentUser.photoURL,
        displayName: currentUser.displayName,
        postText: postText,
        img: downloadURL,
        bytime: Timestamp.now(),
      }),
    });

    setImg(null);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleUpload();
    }
  };

  const addEmoji = (e) => {
    let sym = e.unified.split("-")
    let codesArray = []
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    setPostText(postText + emoji);
  };


  const Emoji = () => {
    setShowEmoji(!showEmoji);
    setShowImg(!showImg);

  };
  const ShowImg = () => {
    setShowImg(true);
  };
  const Wrapp = () => {
    // handleInputClick();
    ShowImg();
    setImg(null);
  };


  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const handleClick = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  new Picker({
    parent: document.querySelector('#picker'),
    data: data,
    emojiButtonSize: 50,
    emojiSize: 38,
    emojiButtonColors: ['rgba(102, 51, 153, .2)'],
    icons: 'solid',
  })



  return (
    <>
      <div className="post-contianer">
        <div className="post-div">


          <div className="post-profile-div">
            <div>

              <Link to={"/profile"}>
                <div style={{ backgroundImage: `url(${currentUser && currentUser.photoURL})` }} className='post-img'>
                  <div className="post-img-dot"></div>
                </div>
              </Link>
            </div>

            <input type="text" className='post-input mx-3' placeholder="What's on your mind ? "
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
              onKeyDown={handleKey}
            />
            <div className='post-send-text' onClick={handleUpload} >Post</div>
          </div>

          <div className='post-icon-container'>
            <label htmlFor="photo" onClick={Wrapp} style={{ cursor: "pointer" }}>
              <div className="post-icon-div">
                <img src={photo} className='post-icon' alt="" />
                <div className="post-icon-text">
                  Photo/Video
                </div>
              </div>
              <input type="file" id="photo" accept="image/*, video/*" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
            </label>


            <label htmlFor="photo" onClick={Wrapp} style={{ cursor: "pointer" }}>
              <div className="post-icon-div">
                <img src={video} className='post-icon' alt="" />
                <div className="post-icon-text">
                  Video
                </div>
              </div>
              <input type="file" id="photo" accept="video/*" onChange={(e) => setImg(e.target.files[0])} style={{ display: "none" }} />
            </label>

            <div className="post-icon-div" onClick={Emoji} >
              <img src={smile} className='post-icon' alt="" />
              <div className="post-icon-text">
                Emoji
              </div>
            </div>
          </div>

          <div className="Selected-imageOrVideo-container">

            {img && img.type.startsWith('image/') && (
              <img className="postImg" src={URL.createObjectURL(img)} alt="" />
            )}

            {img && img.type.startsWith('video/') && (
              <div className="video-container mb-5">
                <video ref={videoRef} onClick={handleClick} className="video ">
                  <source src={URL.createObjectURL(img)} type={img.type} />
                </video>
                {!isPlaying && (
                  <div className="play-button" onClick={handleClick}>
                    <FaPlay className='play-button' />
                  </div>
                )}
              </div>
            )}


          </div>

          {showEmoji && (<div>
            <div className='emoji'>
              <Picker dynamicWidth={false} emojiSize={18} emojiButtonSize={30} onEmojiSelect={addEmoji} />
            </div>
          </div>)}

        </div>
      </div >
    </>
  )
}

export default Post
