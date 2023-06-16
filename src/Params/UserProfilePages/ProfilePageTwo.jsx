
import React, { useContext } from 'react';
import "./ProfilePageTwo.scss";
import { FaUserEdit } from "react-icons/fa"
import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../Firebase';
import { AuthContext } from '../../AuthContaxt';
import { Link } from 'react-router-dom';

const ProfilePageTwo = ({ user }) => {
    const { currentUser } = useContext(AuthContext);

    const option = () => {
        const x = document.getElementById("option");
        if (x.style.display == "none") {
            x.style.display = "flex";
        }
        else {
            x.style.display = "none";
        }
    }


    const SendMessage = async (uid, name) => {

        // Add receiver to sender's friends list
        await addDoc(collection(db, `allFriends/${currentUser.uid}/Message`), {
            userId: uid,
            name: name,
        })

    };


    return (
        <>

            <div className="profile-name-container-main" >
                <h3 className='profile-name-text'>{user.name}</h3>
                <div className='profile-Page-add-btn'>

                    <Link to={`/users/${user.uid}/message`}>
                        <button className='btn btn-primary btn-sm'>Message</button>
                    </Link>

                    <div className='profile-option-div' onClick={option}>
                        <FaUserEdit style={{ fontSize: "24px" }} />
                        <div className="profile-option-absolute" id='option' style={{ display: "none" }}>
                            Unfriend
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProfilePageTwo
// onClick={() => SendMessage(user.uid, user.name)}