import React, { useContext } from 'react'
import "./Setting.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';

const Setting = () => {
    const { currentUser } = useContext(AuthContext);

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    return (
        <>
            <div className="setting-container">
                <div className="setting-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left setting-back"></i>
                </div>

                <div className="setting-profile-div">
                    <img src={currentUser.photoURL} className='setting-profile-img' alt="" />
                    <div className="setting-profile-name">
                        {currentUser.displayName}
                    </div>
                </div>

                <div className="setting-containt">
                    <div>Change Email Address</div>
                    <div>Change Profile Password</div>
                </div>

            </div>
        </>
    )
}

export default Setting
