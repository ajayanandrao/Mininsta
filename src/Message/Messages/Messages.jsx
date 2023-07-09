import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db, storage } from '../../Firebase';
import { Box, CircularProgress, LinearProgress } from '@mui/material';
import "./Messages.scss";
import { MdClose, MdDeleteForever, MdOutlineReply, MdOutlineSend, MdSend } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import { BsFillCameraFill } from 'react-icons/bs';
import { AuthContext } from '../../AuthContaxt';
import { FaDeleteLeft } from "react-icons/fa"
import { IoIosCall, IoMdClose } from "react-icons/io"
import TwilioVideo from 'twilio-video';
import { getDownloadURL, ref, uploadBytesResumable, uploadString } from 'firebase/storage';
import { Close, CloseFullscreen, Delete, DeleteForever } from '@mui/icons-material';

const Messages = () => {

    const { currentUser } = useContext(AuthContext);
    const senderId = currentUser && currentUser.uid;
    const { id } = useParams();

    const [user, setUser] = useState(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [replyInput, setReplyInput] = useState("");
    const [selectedMessageId, setSelectedMessageId] = useState("");
    const [hoveredMessageId, setHoveredMessageId] = useState('');
    const [img, setImg] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [photoid, setPhotoId] = useState("");
    const [photoTime, setPhotoTime] = useState("");

    const ViewMessageImg = (id, photo, time) => {
        setPhoto(photo);
        setPhotoId(id);
        setPhotoTime(time);
    };

    // =====================================

    if (selectedMessageId !== "") {
        const x = document.getElementById("view");
        if (x.style.display == "none") {
            x.style.display = "flex";
        }
    }

    const hideX = () => {
        const x = document.getElementById("view");
        if (x.style.display == "none") {
            x.style.display = "flex";
        } else {
            x.style.display = "none";
        }
    }

    const [viewMessageInput, setViewMessageInput] = useState("");

    const messageListRef = useRef(null);

    useEffect(() => {
        messageListRef.current?.scrollIntoView();
    }, [messages]);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    useEffect(() => {
        const messagesRef = collection(db, 'messages');

        if (user && id) {
            const q = query(
                messagesRef,
                where('sender', 'in', [senderId, user.uid]),
                where('recipient', 'in', [senderId, user.uid]),
                orderBy('timestamp', 'asc')
            );

            const unsubscribe = onSnapshot(q, (snapshot) => {
                const messages = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data()
                }));

                setMessages(messages);
            });

            return () => unsubscribe();
        }
    }, [senderId, user, id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'UpdateProfile', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    setUser({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    const showReplyButton = (messageId) => {
        setHoveredMessageId(messageId);
    };

    const hideReplyButton = () => {
        setHoveredMessageId('');
    };


    function formatTimestamp(timestamp) {
        const date = timestamp.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }
    
    function PhotoFormatTimestamp(timestamp) {
        const date = photoTime.toDate();
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return date.toLocaleString('en-US', options);
    }


    if (!user) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    // const sendMessage = async (uid, name, recipientImg) => {
    //     // Create a new document reference for the messages collection
    //     const messagesRef = collection(db, 'messages');
    //     if (img && senderId) {

    //         const content = replyInput || messageInput;
    //         // Create a new document using `addDoc` function
    //         await addDoc(messagesRef, {
    //             sender: currentUser.uid, // Set the sender's ID
    //             senderImg: currentUser.photoURL,

    //             recipient: uid, // Set the recipient's ID
    //             recipientImg: recipientImg,
    //             message: content, // Set the message content
    //             timestamp: serverTimestamp(), // Set the timestamp (server-side)
    //         });

    //         await addDoc(collection(db, `allFriends/${uid}/Message`), {
    //             userId: currentUser.uid,
    //             name: currentUser.displayName,
    //             photoUrl: currentUser.photoURL,
    //             time: serverTimestamp()
    //         });

    //         // Add receiver to sender's friends list
    //         await addDoc(collection(db, `allFriends/${currentUser.uid}/Message`), {
    //             userId: uid,
    //             name: name,
    //             photoUrl: recipientImg,
    //             time: serverTimestamp()
    //         });

    //     }
    //     // Clear the message input field after sending the message
    //     setMessageInput("");
    // };

    const sendMessage = async (uid, name, recipientImg) => {
        // Create a new document reference for the messages collection
        const messagesRef = collection(db, 'messages');
        setMessageInput("");

        if (senderId) {
            const content = replyInput || messageInput;
            const newMessage = {
                sender: currentUser.uid,
                senderImg: currentUser.photoURL,
                recipient: uid,
                recipientImg: recipientImg,
                message: content,
                timestamp: serverTimestamp(),
            };

            if (img) {
                const storageRef = ref(storage, `messageImages/${img.name}`);
                const uploadTask = uploadBytesResumable(storageRef, img, 'data_url');

                // Listen to the upload progress events
                uploadTask.on('state_changed',
                    (snapshot) => {
                        // Handle progress updates here
                        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        console.log('Upload progress: ' + progress + '%');
                        if (progress < 100) {
                            document.getElementById("progress").style.display = "block";
                        } else {
                            setImg(null);
                            document.getElementById("progress").style.display = "none";
                        }
                    },
                    (error) => {
                        // Handle any errors that occur during the upload
                        console.error('Upload error:', error);
                    },
                    async () => {
                        // Upload completed successfully
                        console.log('Upload completed');
                        // Get the download URL of the uploaded image
                        const imageUrl = await getDownloadURL(storageRef);
                        newMessage.imageUrl = imageUrl;
                        await addDoc(messagesRef, newMessage);
                    }
                );
            } else {
                await addDoc(messagesRef, newMessage);
            }

            await addDoc(collection(db, `allFriends/${uid}/Message`), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                time: serverTimestamp(),
            });

            // Add receiver to sender's friends list
            await addDoc(collection(db, `allFriends/${currentUser.uid}/Message`), {
                userId: uid,
                name: name,
                photoUrl: recipientImg,
                time: serverTimestamp(),
            });
        }

        setMessageInput("");

    };



    const deleteMessage = async (messageId) => {
        console.log(messageId);
        const messageRef = doc(db, 'messages', messageId);
        await deleteDoc(messageRef);
    };

    const DeletePhoto = async (id) => {
        console.log(id);
        const messageRef = doc(db, 'messages', id);
        await deleteDoc(messageRef);
        setPhoto(null);
    };



    const sendReply = async (messageId) => {
        const selectedMessage = messages.find((message) => message.id === messageId);

        const messagesRef = collection(db, 'messages');
        if (senderId) {
            // Create a new document using `addDoc` function
            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                recipient: selectedMessage.sender, // Set the recipient's ID
                message: messageInput, // Set the message content
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
                reply: `Reply to: ${selectedMessage.message}` // Include the reply information
            });
        }

        setSelectedMessageId("");
        setMessageInput("");
    };

    const SendLike = async (uid, name, recipientImg) => {
        if (senderId) {
            const messagesRef = collection(db, 'messages');
            const content = replyInput || messageInput;
            // Create a new document using `addDoc` function
            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                message: "👍",
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });
        }
    }

    // e.preventDefault();

    return (
        <div>


            <div className="message-container">
                <div className='message-container-wrapper'>

                    {photo &&
                        <div className='photo-div'>
                            <div className="photo-div-inner">



                                {PhotoFormatTimestamp(photoTime)}
                                <div className="photo-bg-div" style={{ backgroundImage: `url(${photo})` }}>

                                    <div className="photo-bg-inner-div">

                                        <div className="photo-close-div" onClick={() => setPhoto(null)}>
                                            <IoMdClose className='photo-close' />
                                        </div>

                                        <div className="photo-close-div" onClick={() => DeletePhoto(photoid)}>
                                            <DeleteForever className='photo-delete' />
                                        </div>
                                    </div>
                                </div>

                                {/* <img src={photo} className='photo' alt="" /> */}
                            </div>
                        </div>
                    }


                    <div className="message-profile-div">
                        <i onClick={goBack} className="bi bi-arrow-left message-arrow "></i>
                        <img className='message-profile-img' src={user.userPhoto} alt="" />
                        <span className='message-profile-name'>{user.name}</span>
                    </div>

                    {/* <div className="main-wrapper"> */}




                    <div className="message-list-container">

                        {messages.map((message, index) => {
                            if (
                                (message.sender === currentUser.uid && message.recipient === user.uid) ||
                                (message.sender === user.uid && message.recipient === currentUser.uid)
                            ) {
                                const isSender = message.sender === currentUser.uid;
                                const messageClass = isSender ? 'sender' : 'user';
                                const isRecipient = message.recipient === user.uid;
                                const hasImage = !!message.imageUrl; // Check if message has an imageUrl

                                return (
                                    <>
                                        <div
                                            key={index}
                                            onMouseEnter={() => showReplyButton(message.id)}
                                            onMouseLeave={hideReplyButton}
                                            className={`message-item ${messageClass}`}
                                        >
                                            {isSender && hoveredMessageId === message.id && (
                                                <div>
                                                    <div
                                                        className="delete-button"
                                                        onClick={() => {
                                                            deleteMessage(message.id);
                                                        }}
                                                    >
                                                        <i className="bi bi-x-circle-fill"></i>
                                                    </div>
                                                </div>
                                            )}

                                            <div
                                                className={`message-bubble ${isSender ? 'message-sender' : 'message-recipient'} ${hasImage ? 'has-image' : '' /* Add 'has-image' class when message has an image */
                                                    }`}
                                            >
                                                {!isSender && <img className="message-img" src={user.userPhoto} alt="Sender" />}

                                                <div>
                                                    {isSender && hoveredMessageId === message.id && (
                                                        <div className="last-conversation-time">{formatTimestamp(message.timestamp)}</div>
                                                    )}

                                                    {message.reply && <div className="message-reply">{message.reply}</div>}

                                                    {!isSender && hoveredMessageId === message.id && (
                                                        <div className="last-conversation-time">{formatTimestamp(message.timestamp)}</div>
                                                    )}


                                                    {hasImage && <img onClick={() => ViewMessageImg(message.id, message.imageUrl, message.timestamp)} src={message.imageUrl}
                                                        className='messageImg' alt="Message" />}

                                                    {message.message && <div className="message-content">{message.message}</div>}


                                                </div>
                                            </div>

                                            {!isSender && hoveredMessageId === message.id && (
                                                <div>
                                                    <div
                                                        className="reply-button"
                                                        onClick={() => {
                                                            setSelectedMessageId(message.id);
                                                            setViewMessageInput(message.message);
                                                        }}
                                                    >
                                                        <MdOutlineReply />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            }

                            return null;
                        })}

                        <div ref={messageListRef} />

                    </div>



                    {/* </div> */}
                    <div className='message-input-wrapper'>
                        <div className='view-Reply'>
                            <div className='view-replay-sms'>
                                <div style={{ fontWeight: "600" }}> {viewMessageInput}</div>
                            </div>
                            <div id='view' style={{ display: "none" }}
                                onClick={() => {
                                    setSelectedMessageId("");
                                    setViewMessageInput(""); hideX();
                                }}
                                className='view-close-btn m-4'>
                                <MdClose style={{ fontSize: "16px" }} />
                            </div>
                        </div>

                        <div className="imgSelected-div">
                            <div className="loading">
                                <CircularProgress id='progress' style={{ display: "none" }} />
                            </div>
                            {img ? <img src={URL.createObjectURL(img)} className='imgSelected-img' alt="" /> : ""}
                            <div className="imgSelected-close-div">
                                {img ?
                                    <>
                                        < IoMdClose className='imgSelected-close-img' onClick={(e) => setImg(null)} />
                                    </>
                                    : ""
                                }
                            </div>
                        </div>

                        <div className='message-input-wrapper-inner'>

                            <label htmlFor="imgFiles">
                                <BsFillCameraFill className='message-camera ms-icon' />
                            </label>

                            <input id='imgFiles' style={{ display: "none" }} type="file" onChange={(e) => setImg(e.target.files[0])} />

                            <input
                                type="text"
                                onChange={(e) => setMessageInput(e.target.value)}
                                value={messageInput}
                                className="message-input"
                                placeholder="Type..."
                                autoFocus
                            />

                            <MdSend
                                className="message-send-btn ms-icon"
                                onClick={() => {
                                    if (selectedMessageId) {
                                        sendReply(selectedMessageId);

                                    } else {
                                        sendMessage(user.uid, user.name, user.userPhoto);
                                    }
                                }}
                            />

                            <FaThumbsUp className='message-thumb ms-icon' onClick={() => SendLike(user.uid, user.name, user.userPhoto)} />
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

export default Messages
