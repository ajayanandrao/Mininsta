import React, { useContext } from 'react'
import "./Option.scss";
import { MdDarkMode, MdMovieFilter } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../Firebase';
import { signOut } from 'firebase/auth';
import { AuthContext } from '../AuthContaxt';
import { MdMovie } from "react-icons/md";
import { FcFilmReel } from "react-icons/fc";
import { GiLovers } from "react-icons/gi";
import love from "./../Image/hearts100.png";
import video from "./../Image/v3.png";
import movie from "./../Image/m4.png";
import { BsFillDoorClosedFill } from 'react-icons/bs';

const Option = () => {
    const { currentUser } = useContext(AuthContext);

    const LogOut = async () => {
        const PresenceRef = doc(db, "userPresece", currentUser.uid);

        await updateDoc(PresenceRef, {
            status: "Offline",
        });

        const PresenceRefOnline = doc(db, "OnlyOnline", currentUser.uid);
        await deleteDoc(PresenceRefOnline);

        signOut(auth)
            .then(() => {
                // Sign-out successful.
            })
            .catch((error) => {
                // An error happened.
            });

        nav("/");
    };

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    return (
        <>
            <div className="option-container w3-animate-opacity">

                <div className="option-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left "></i>
                </div>
                <div className="option-inner-div">

                    <div className="option-profile-div">
                        <img src={currentUser && currentUser.photoURL} className='option-profile-img' alt="" />

                        <span className='option-profile-text'>{currentUser && currentUser.displayName}</span>
                    </div>

                    <Link to="/setting/">
                        <div className="option-mainu">

                            <div className="option-mainu-icon">
                                <i className="bi bi-gear-fill"></i>
                            </div>
                            <div className="option-mainu-name">
                                Setting
                            </div>

                        </div>
                    </Link>

                    <Link to="/movies/">
                        <div className="option-mainu">
                            <div className="option-mainu-icon">
                                {/* <MdMovie /> */}
                                <img src={movie} style={{width:"30px"}} className='option-image-icon' alt="" />
                            </div>
                            <div className="option-mainu-name" >
                                Movies
                            </div>
                        </div>
                    </Link>
                    <Link to="/Wedding/">
                        <div className="option-mainu">
                            <div className="option-mainu-icon">
                                {/* <GiLovers /> */}
                            <img src={love} className='option-image-icon' alt="" />
                            </div>
                            <div className="option-mainu-name" >
                                Matrimony Arrange
                            </div>
                        </div>
                    </Link>
                    <Link to="/reels/">
                        <div className="option-mainu">
                            <div className="option-mainu-icon">
                                {/* <MdMovieFilter /> */}
                                <img src={video} style={{width:"30px"}} className='option-image-icon' alt="" />
                            </div>
                            <div className="option-mainu-name" >
                                Reals
                            </div>
                        </div>
                    </Link>

                    <div className="option-mainu">
                        <div className="option-mainu-icon">
                            <BsFillDoorClosedFill className="" style={{fontSize:"30px"}}/>
                            {/* <i className="bi bi-door-open-fill" onClick={LogOut}></i> */}
                        </div>
                        <div className="option-mainu-name" onClick={LogOut}>
                            Log Out
                        </div>
                    </div>



                </div>
            </div>
        </>
    )
}

export default Option
