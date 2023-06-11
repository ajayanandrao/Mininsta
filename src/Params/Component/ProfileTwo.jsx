import React from 'react'
import "./ProfileTwo.scss";

const ProfileTwo = ({ user }) => {
    return (
        <>
            <div className="profile-name-container-main">
                <h3 className='profile-name-text'>{user.name}</h3>
                <div className='profile-add-btn'>
                    <button className='btn btn-info btn-sm'>Add</button>
                    <button className='btn btn-info btn-sm'>Message</button>
                </div>
            </div>
        </>
    )
}

export default ProfileTwo
