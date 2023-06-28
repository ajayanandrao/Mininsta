import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { CircularProgress } from '@mui/material';
import "./Messages.scss";
import { MdClose, MdDeleteForever, MdOutlineReply, MdOutlineSend, MdSend } from 'react-icons/md';
import { FaThumbsUp } from 'react-icons/fa';
import { BsFillCameraFill } from 'react-icons/bs';
import { AuthContext } from '../../AuthContaxt';
import { FaDeleteLeft } from "react-icons/fa"
import { IoIosCall } from "react-icons/io"
import TwilioVideo from 'twilio-video';

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


    if (!user) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    const sendMessage = async (uid, name, recipientImg) => {
        // Create a new document reference for the messages collection
        const messagesRef = collection(db, 'messages');
        if (senderId) {

            const content = replyInput || messageInput;
            // Create a new document using `addDoc` function
            await addDoc(messagesRef, {
                sender: currentUser.uid, // Set the sender's ID
                senderImg: currentUser.photoURL,

                recipient: uid, // Set the recipient's ID
                recipientImg: recipientImg,
                message: content, // Set the message content
                timestamp: serverTimestamp(), // Set the timestamp (server-side)
            });

            await addDoc(collection(db, `allFriends/${uid}/Message`), {
                userId: currentUser.uid,
                name: currentUser.displayName,
                photoUrl: currentUser.photoURL,
                time: serverTimestamp()
            });

            // Add receiver to sender's friends list
            await addDoc(collection(db, `allFriends/${currentUser.uid}/Message`), {
                userId: uid,
                name: name,
                photoUrl: recipientImg,
                time: serverTimestamp()
            });

        }
        // Clear the message input field after sending the message
        setMessageInput("");
    };

    const deleteMessage = async (messageId) => {
        console.log(messageId);
        const messageRef = doc(db, 'messages', messageId);
        await deleteDoc(messageRef);
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

    const callFriend = async () => {
        try {
            // Initialize Twilio Video token and room details
            const response = await fetch('/api/twilio/token'); // Replace with your server endpoint to generate Twilio token
            const { token, room } = await response.json();

            // Join the video call room using Twilio Video library
            await TwilioVideo.connect(token, {
                roomName: room,
                audio: true,
                video: true,
            });
        } catch (error) {
            console.error('Error calling friend:', error);
        }
    };



    return (
        <div>
            <div className="message-container">
                <div className="message-profile-div">
                    <i onClick={goBack} className="bi bi-arrow-left message-arrow "></i>
                    <img className='message-profile-img' src={user.userPhoto} alt="" />
                    <span className='message-profile-name'>{user.name}</span>
                    <div className="call-div">
                        {/* <IoIosCall style={{ fontSize: "24px" }} onClick={callFriend} /> */}
                        {/* <IoIosCall style={{ fontSize: "24px" }}  /> */}
                        <i className="bi bi-camera-video-fill" style={{ fontSize: "24px" }} onClick={callFriend}></i>

                    </div>
                </div>

                <div className="message-list-container">
                    {messages.map((message, index) => {
                        if (
                            (message.sender === currentUser.uid && message.recipient === user.uid) ||
                            (message.sender === user.uid && message.recipient === currentUser.uid)
                        ) {
                            const isSender = message.sender === currentUser.uid;
                            const messageClass = isSender ? 'sender' : 'user';
                            const isRecipient = message.recipient === user.uid;

                            return (
                                <div key={index} onMouseEnter={() => showReplyButton(message.id)}
                                    onMouseLeave={hideReplyButton}
                                    className={`message-item ${messageClass}`}>

                                    {isSender && hoveredMessageId === message.id && (
                                        <div>
                                            <div
                                                className="delete-button"
                                                onClick={() => {
                                                    deleteMessage(message.id);
                                                }}
                                            >
                                                <i class="bi bi-x-circle-fill"></i>
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className={`message-bubble ${isSender ? "message-sender" : "message-recipient"
                                            }`}
                                    >
                                        {isSender && (
                                            <></>
                                            // <img className='message-img' src={currentUser.photoURL} alt="Sender" />
                                        )}
                                        {!isSender && (
                                            <img className='message-img' src={user.userPhoto} alt="Sender" />
                                        )}
                                        <div>
                                            {message.reply && (
                                                <div className="message-reply">{message.reply}</div>
                                            )}
                                            <div className="message-content">{message.message}</div>
                                        </div>
                                    </div>

                                    {!isSender && hoveredMessageId === message.id && (
                                        <div>
                                            <div
                                                className="reply-button"
                                                onClick={() => {
                                                    setSelectedMessageId(message.id);
                                                    setViewMessageInput(message.message)
                                                }}
                                            >
                                                <MdOutlineReply />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }

                        return null;
                    })}

                    <div ref={messageListRef} />

                </div>

                <div className="message-input-container">

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

                    <div className="message-wrapper">
                        <BsFillCameraFill className='message-camera' />

                        <input
                            type="text"
                            onChange={(e) => setMessageInput(e.target.value)}
                            value={messageInput}
                            className="message-input"
                            placeholder="Type..."
                            autoFocus
                        />

                        <MdSend
                            className="message-send-btn"
                            onClick={() => {
                                if (selectedMessageId) {
                                    sendReply(selectedMessageId);

                                } else {
                                    sendMessage(user.uid, user.name, user.userPhoto);
                                }
                            }}
                        />
                        <FaThumbsUp className='message-thumb' onClick={() => SendLike(user.uid, user.name, user.userPhoto)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messages
