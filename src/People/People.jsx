import React, { useContext, useEffect, useState } from 'react'
import "./People.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { db } from "../Firebase";
import { collection, deleteDoc, doc, getDoc, onSnapshot, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { AuthContext } from "./../AuthContaxt";
import { v4 } from 'uuid';

const People = ({ userP }) => {

    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const [api, setApiData] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'users');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setApiData(newApi);
        });

        return unsubscribe;
    }, []);

    // add friend

    const [friendRequests, setFriendRequests] = useState([]);
    const [addedUsers, setAddedUsers] = useState(false);

    const handleAddFriend = (id) => {

        setAddedUsers(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
        console.log(id)
    };


    function sendFriendRequest(id, otherUserId, otherUserName, otherUserPhotoUrl) {
        const x = document.getElementById(`add-${id}`)

        if (x.style.display == "inline-block") {
            x.style.display = "none"
        }

        setDoc(doc(db, "friendRequests", id), {
            btnStatus: "on",
            name: otherUserName,
            sender: currentUser.uid
        });

        // Check if friend request already exists
        const requestExists = friendRequests.some(
            (request) =>
                (request.senderUid === currentUser.uid && request.receiverUid === otherUserId) ||
                (request.senderUid === otherUserId && request.receiverUid === currentUser.uid)
        );

        if (requestExists) {
            alert('Friend request already exists');
            return;
        }

        // Create a new friend request document in the "friendRequests" collection
        const friendRef = doc(db, 'friendRequests', v4());
        setDoc(friendRef, {
            senderUid: currentUser.uid,
            senderName: currentUser.displayName,
            senderPhotoUrl: currentUser.photoURL,
            sender: "sender",

            receiverPhotoUrl: otherUserPhotoUrl,
            receiverUid: otherUserId,
            receiverName: otherUserName,
            status: 'pending',
            timestamp: serverTimestamp(),
        })

            .then((docRef) => {
                console.log('Friend request sent to:', docRef.id);
                // Handle success
            })
            .catch((error) => {
                console.error('Error sending friend request:', error);
                // Handle error
            });
    }

    useEffect(() => {

        const colRef = collection(db, 'friendRequests')
        const userlist = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setFriendRequests(newbooks);
            })
        };
        return userlist();
    }, []);


    const DeleteRequest = async (id) => {
        const x = document.getElementById(`add-${id}`)

        if (x.style.display == "none") {
            x.style.display = "inline-block"
        }
        setDoc(doc(db, "friendRequests", id), {
            btnStatus: "off"
            //remove the name because it will be false 
        });
    };


    const [request, setRequest] = useState([]);
    useEffect(() => {
        const colRef = collection(db, 'friendRequests');
        const unsubscribe = onSnapshot(colRef, (snapshot) => {
            const newApi = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setRequest(newApi);
        });

        return unsubscribe;
    }, []);


    return (
        <>
            <div className="People-container">
                <div className="People-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left "></i>
                    <input type="text"
                        className='People-User-input'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                        placeholder='Search friends' />
                </div>
            </div>

            <div className="People-user-List">
                {
                    api
                        .filter((value) => {
                            if (search === "") {
                                return value;
                            } else if (
                                value.name.toLowerCase().includes(search.toLowerCase())
                            ) {
                                return value;
                            }
                        })
                        .map((item) => {

                            if (item.uid !== currentUser.uid) {
                                return (
                                    <div key={item.id}>

                                        <div className="people-container">

                                            <div>
                                                <img src={item.PhotoUrl} className='people-img' alt="" />
                                            </div>
                                            <div className="people-name-div">
                                                <div className='people-name'>{item.name}</div>
                                                <div className='people-btn-div'>
                                                    {/* <div
                                                        className="btn-info-custom"
                                                        onClick={() => handleAddFriend(item.id)}>
                                                        {addedUsers[item.id] ? "Cancle" :
                                                            (<><div onClick={() => sendFriendRequest(item.id, item.uid, item.name, item.PhotoUrl)}>Add a friend</div></>)}
                                                    </div> */}

                                                    <div
                                                        id={`add-${item.id}`}
                                                        className="btn-primary-custom"
                                                        onClick={() => sendFriendRequest
                                                            (item.id, item.uid, item.name, item.PhotoUrl)}>Add a friend</div>


                                                    {request.map((re) => {

                                                        if (re.name === item.name && re.sender === currentUser.uid) {

                                                            return (
                                                                <>
                                                                    <button
                                                                        className="btn-D-custom "
                                                                        onClick={() => DeleteRequest(item.id)}
                                                                    >
                                                                        Cancle Request
                                                                    </button>
                                                                </>
                                                            )
                                                        }
                                                    })}

                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                );
                            }


                        })
                }
            </div>
            <div className="People-user-bottom">

            </div>
        </>
    )
}

export default People



{/* <div className="People-user-profile-div">
                                        <img
                                            src={item.PhotoUrl}
                                            className="People-user-profile-img"
                                            alt=""
                                        />
                                        <div className="People-add-div">
                                            <Link to={`/users/${item.uid}`}>
                                                <div className="People-user-profile-name">{item.name}</div>
                                            </Link>

                                            <div className='people-btn-div mt-2'>
                                                <div className="btn-info-custom">Add</div>
                                                <div className="btn-info-custom mx-2">Remove</div>
                                            </div>
                                        </div>

                                    </div> */}