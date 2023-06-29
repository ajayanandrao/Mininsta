import React, { useContext, useEffect, useState } from 'react'
import "./MobileNavebar.scss";
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiSearchLine } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { auth, db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import { BsFillPeopleFill } from 'react-icons/bs';
import { collection, onSnapshot } from 'firebase/firestore';
import { MdMovieFilter } from "react-icons/md";
import v from "./../Image/img/vl.png";

const MobileNavebar = () => {

    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            if (user) {
                document.getElementById("navId").style.display = "flex";
                document.getElementById("navIdB").style.display = "flex";
            } else {
                document.getElementById("navId").style.display = "none";
                document.getElementById("navIdB").style.display = "none";
            }
        });
        return unsub;
    }, []);


    const dataRef = collection(db, "users");
    const [userPhoto, setUserPhoto] = useState(null);

    useEffect(() => {
        const unsub = onSnapshot(dataRef, (snapshot) => {
            setUserPhoto(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

    return (
        <>
            <div className="mobile-nav-container" id='navIdB'>
                <Link to="home/" style={{ textDecoration: 'none' }}> <div className='mobile-nav-title'>
                    <img src={v} className='logo' alt="" />
                </div></Link>

                <div className='mobile-item-div'>

                    <span className='mobile-nav-mainu'>
                        <Link to="find_friend/" className='link'>
                            <div className="home">
                                <BsFillPeopleFill className='mobile-nav-icon' />
                            </div>
                        </Link>
                    </span>

                    <span className='mobile-nav-mainu'>
                        <Link to="search/" className='link'>
                            <div className="home">
                                <RiSearchLine className='mobile-nav-icon' />
                            </div>
                        </Link>
                    </span>

                    <span className='mobile-nav-mainu'>
                        <Link to="option/" className='link'>
                            <RxHamburgerMenu className='mobile-nav-icon' />
                        </Link>
                    </span>


                </div>
            </div>

            <div className="mobile-nav-bottom-container " id='navId'>
                <Link to={"home/"}>
                    <AiFillHome className='mobile-nav-bottom-icon' />
                </Link>
                <div >
                    <AiFillHeart className='mobile-nav-bottom-icon' />
                </div>

                <Link to="message/">
                    <div >
                        <i className="bi bi-messenger"></i>
                    </div>
                </Link>

                <Link to="reels">
                    <div >
                        <MdMovieFilter className='mobile-nav-bottom-icon' />
                    </div>
                </Link>

                <Link to={"profile/"}>
                    <div >
                        <img src={currentUser && currentUser.photoURL} alt="" className='mobile-nav-bottom-photo' />
                    </div>
                </Link>
                {/* <AiFillHeart className='mobile-nav-bottom-icon' /> */}
            </div>
        </>
    )
}

export default MobileNavebar
