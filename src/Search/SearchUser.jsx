import React from 'react'
import "./SearchUser.scss";
import { MdDarkMode } from "react-icons/md"
import { Link, useNavigate } from 'react-router-dom';

const SearchUser = () => {

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    return (
        <>
            <div className="Search-container">
                <div className="Search-back-div">
                    <i onClick={goBack} class="bi bi-arrow-left "></i>
                    <input type="text" className='Seatch-User-input' placeholder='Search User' />
                </div>
            </div>

            <div className="Search-user-List">
                <div className="Search-user-profile-div">
                    <img src="https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg" className='Search-user-profile-img' alt="" />
                    <div className='Search-user-profile-name'>Bill Gate </div>
                </div>
            </div>

            <div className="Search-user-bottom">
                d
            </div>
        </>
    )
}

export default SearchUser
