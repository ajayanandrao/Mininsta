import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../Firebase';
import ProfilePageOne from './UserProfilePages/ProfilePageOne';
import ProfilePageTwo from './UserProfilePages/ProfilePageTwo';
import ProfilePageThree from './UserProfilePages/ProfilePageThree';
import { CircularProgress } from '@mui/material';

import "./UserProfilePage.scss";

const UsersProfilePage = () => {
    const { id } = useParams();

    const [user, setUser] = useState(null);

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

    if (!user) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div>
        </>;
    }
    return (
        <>
            <div className="UserDetails-bg-container w3-animate-opacity">
                <ProfilePageOne user={user} />
                <ProfilePageTwo user={user} />
                <ProfilePageThree user={user} />
                <div className='height'></div>
            </div>
        </>
    )
}

export default UsersProfilePage
