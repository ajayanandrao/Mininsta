import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import "./Friends.scss";
import { Link } from 'react-router-dom';

const Friends = () => {
    const { currentUser } = useContext(AuthContext);
    const [search, setSearch] = useState("");

    const [friendsList, setFriendsList] = useState([]);
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const friendsQuery = query(collection(db, `allFriends/${currentUser.uid}/Friends`));
                const friendsSnapshot = await getDocs(friendsQuery);
                const friendsData = friendsSnapshot.docs.map(doc => doc.data());
                setFriendsList(friendsData);
            } catch (error) {
                console.error('Error fetching friends:', error);
            }
        };

        fetchFriends();
    }, [currentUser]);


    return (
        <>
            <h2>Friends</h2>

            <input type="text"
                placeholder='Serch friends'
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                className='friend-search' />

            <div className="grid-parent-container">
                <div className='friend-container'>
                    {friendsList.length > 0 ? (
                        <>
                            {friendsList.filter((value) => {
                                if (search === "") {
                                    return value;
                                } else if (
                                    value.name.toLowerCase().includes(search.toLowerCase())
                                ) {
                                    return value;
                                }
                            }).map((friend) => (
                                <div key={friend.userId} >
                                    <Link style={{textDecoration:"none"}} to={`/users/${friend.userId}/profile`}>
                                        <img src={friend.photoUrl} className='friend-img' alt="" />
                                        <div className='friend-name'>{friend.name}</div>
                                    </Link>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No friends found.</p>
                    )}
                </div>
            </div>
        </>
    )
}

export default Friends 
