import React, { useContext, useEffect, useRef, useState } from 'react'
import "./Message.scss";
// import "./../Styles/flickity.scss";
import { useNavigate } from 'react-router-dom';
import Flickity from 'react-flickity-component';
import natur from "./nature.json";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { styled, keyframes } from '@mui/system';
import Badge from '@mui/material/Badge';
import { AuthContext } from './../AuthContaxt';
import { Avatar } from '@mui/material';


const Message = () => {
    const { currentUser } = useContext(AuthContext);
    const [api, setApiData] = useState([]);
    const [search, setSearch] = useState("");
    const colRef = collection(db, 'users');

    useEffect(() => {
        const unsub = () => {
            onSnapshot(colRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setApiData(newbooks);
            })
        };
        return unsub();
    }, []);

    // online

    const [onlineUsers, setOnlineUsers] = useState([]);

    useEffect(() => {
        const userRef = collection(db, 'OnlyOnline');
        const unsub = () => {
            onSnapshot(userRef, (snapshot) => {
                let newbooks = []
                snapshot.docs.forEach((doc) => {
                    newbooks.push({ ...doc.data(), id: doc.id })
                });
                setOnlineUsers(newbooks);
            })
        };
        return unsub();
    }, []);

    const StyledBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            backgroundColor: '#44b700',
            // border: '1px solid red',
            color: '#44b700',
            boxShadow: `0 0 0 2px `,
            width: '2px',
            height: '8px',
            '&::after': {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                borderRadius: '100%',
                animation: `${rippleAnimation} 1.2s infinite ease-in-out`,
                border: '1px solid currentColor',
                content: '""',
            },
        },
    }));


    const rippleAnimation = keyframes`
    0% {
      transform: scale(0.2);
      opacity: 1;
    }
    
    100% {
      transform: scale(3);
      opacity: 0;
    }
  `;


    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const flickityOptions = {
        initialIndex: 1,
        accessibility: true,
        wrapAround: true,
    }

    function openCity(cityName) {
        var i;
        var x = document.getElementsByClassName("city");
        for (i = 0; i < x.length; i++) {
            x[i].style.display = "none";
        }
        document.getElementById(cityName).style.display = "block";
    }
    return (
        <>
            <div className="Message-container">
                <div className="Message-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left "></i>
                    <input type="text" className='Message-User-input'
                        onChange={(e) => setSearch(e.target.value)}
                        value={search} placeholder='Message-User' />
                </div>
            </div>

            <div className="Message-user-List">


                <div className="tab-block">
                    <button className="w3-bar-item w3-button" onClick={() => openCity('London')}>Message</button>
                    <button className="w3-bar-item w3-button" onClick={() => openCity('Paris')}>Online</button>
                    <button className="w3-bar-item w3-button" onClick={() => openCity('Tokyo')}>People</button >
                </div >


                <div id="London" className="w3-container w3-animate-left city">
                    <h2 className='tab-title'>Sorry</h2>
                    <p>Developers are working on this page.</p>
                </div>

                <div id="Paris" className="w3-container w3-animate-bottom city" style={{ display: "none" }}>

                    {onlineUsers.map((item) => {
                        if (item.uid !== currentUser.uid) {
                            return (
                                <div key={item.id} className="online-user-div">

                                    <span>
                                        <StyledBadge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'top',horizontal: 'right' }}
                                            variant="dot"
                                        >
                                            <Avatar alt="Remy Sharp" src={item.photoUrl} />
                                        </StyledBadge>

                                    </span>

                                    <span className="online-user-name">{item.presenceName}</span>
                                </div>
                            )

                        }
                    })}

                </div>

                <div id="Tokyo" className="w3-container w3-animate-right city" style={{ display: "none" }}>

                    {
                        api
                            .filter((value) => {
                                if (search === "") {
                                    return value;
                                } else if (
                                    value.name.toLowerCase().includes(search.toLowerCase())
                                ) {
                                    return value;
                                }
                            })
                            .map((item) => {
                                return (
                                    <div key={item.id}>
                                        <div className="People-container">
                                            <img
                                                src={item.PhotoUrl}
                                                className="People-profile-img"
                                                alt=""
                                            />
                                            <div className="People-profile-name">{item.name}</div>
                                        </div>
                                    </div>
                                );
                            })
                    }


                </div>


            </div >

            <div className="Message-user-bottom"></div>
        </>
    )
}

export default Message
