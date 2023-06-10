import React, { useContext, useEffect } from 'react'
import "./MobileNavebar.scss";
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiSearchLine } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import { AiFillHeart } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { auth } from '../Firebase';
import { AuthContext } from '../AuthContaxt';


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

    return (
        <>
            <div className="mobile-nav-container" id='navIdB'>
                <Link to="home/" className='link'> <div className='mobile-nav-title'>Ajay</div></Link>
                <div className='mobile-item-div'>

                    <span className='mobile-nav-mainu'>
                        <Link to="search/" className='link'>
                            <RiSearchLine className='mobile-nav-icon' />
                        </Link>
                    </span>
                    <span className='mobile-nav-mainu'>
                        <Link to="option/" className='link'>
                            <RxHamburgerMenu className='mobile-nav-icon' />
                        </Link>
                    </span>

                </div>
            </div>

            <div className="mobile-nav-bottom-container" id='navId'>
                <AiFillHome className='mobile-nav-bottom-icon' />
                <AiFillHeart className='mobile-nav-bottom-icon' />
                <Link to="message/"> <i className="bi bi-messenger"></i></Link>
                <img src={currentUser && currentUser.photoURL} alt="" className='mobile-nav-bottom-photo' />
                {/* <AiFillHeart className='mobile-nav-bottom-icon' /> */}
            </div>
        </>
    )
}

export default MobileNavebar
