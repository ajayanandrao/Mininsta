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

                    {/* <div className="option-mainu">
                        <div className="option-mainu-icon">
                            <i className="bi bi-moon-fill"></i>
                        </div>
                        <div className="option-mainu-name">
                            Dark Mode
                        </div>
                    </div> */}
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
                                <MdMovie />
                            </div>
                            <div className="option-mainu-name" >
                                Movies
                            </div>
                        </div>
                    </Link>
                    <Link to="/reels/">
                        <div className="option-mainu">
                            <div className="option-mainu-icon">
                                <MdMovieFilter />
                            </div>
                            <div className="option-mainu-name" >
                                Reals
                            </div>
                        </div>
                    </Link>

                    <div className="option-mainu">
                        <div className="option-mainu-icon">
                            <i className="bi bi-door-open-fill" onClick={LogOut}></i>
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
