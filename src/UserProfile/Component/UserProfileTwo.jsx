import React, { useContext } from 'react'
import "./UserProfileTwo.scss";
import { AuthContext } from "./../../AuthContaxt";
import { HiPencil } from "react-icons/hi"

const ProfileTwo = ({ user }) => {
    const { currentUser } = useContext(AuthContext);

    return (
        <>
            <div className="profile-name-container">
                <h3 className='profile-name-text'>{currentUser && currentUser.displayName}</h3>
                <div className="profile-Edit-btn">
                    <HiPencil className='edit-pencil'/>
                </div>
            </div>
        </>
    )
}

export default ProfileTwo
