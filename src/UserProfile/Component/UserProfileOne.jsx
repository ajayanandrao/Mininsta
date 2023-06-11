import React, { useContext } from 'react'
import "./UserProfileOne.scss";
import { useNavigate } from 'react-router-dom';
import { BsFillCameraFill } from "react-icons/bs";
import { AuthContext } from "./../../AuthContaxt";

const ProfileOne = () => {
    const { currentUser } = useContext(AuthContext);
    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    return (
        <>
            <div>
                <div className="profile-cover-photo-div"
                    style={{ backgroundImage: `url("https://images.unsplash.com/photo-1549247796-5d8f09e9034b?ixlib=rb-4.0.3&amp;ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&amp;auto=format&amp;fit=crop&amp;w=1158&amp;")` }}
                >
                    <div className="profile-cover-camera-btn-div">
                        <BsFillCameraFill className='profile-cover-camera-btn' />
                    </div>
                    <div className="profile-pic-bg-div">
                       
                        <div className="profile-pic-div" style={{ backgroundImage: `url(${currentUser && currentUser.photoURL})` }}>
                            <div className="photo-edit-div">
                                <BsFillCameraFill className='photo-camera'/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfileOne
