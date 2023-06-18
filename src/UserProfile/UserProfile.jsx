import React, { useEffect, useState } from 'react'
import "./UserProfile.scss";
import UserProfileOne from "./Component/UserProfileOne";
import UserProfileTwo from "./Component/UserProfileTwo";
import UserProfileThree from "./Component/UserProfileThree";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase';

const UserProfile = () => {


    return (
        <>
            <div className='userProfile-container w3-animate-opacity'>
                <UserProfileOne />
                <UserProfileTwo />
                <UserProfileThree />
                <div className='bottom-margin'></div>
            </div>
        </>
    )
}

export default UserProfile
