import React, { useEffect, useRef, useState } from 'react'
import "./Message.scss";
import "./../Styles/flickity.scss";
import { useNavigate } from 'react-router-dom';
import Flickity from 'react-flickity-component';
import natur from "./nature.json";
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';

const Message = () => {
    const [api, setApiData] = useState([]);
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

    const nav = useNavigate();
    const goBack = () => {
        nav(-1);
    }

    const flickityOptions = {
        initialIndex: 1,
        accessibility: true,
        wrapAround: true,
    }
    return (
        <>
            <div className="Message-container">
                <div className="Message-back-div">
                    <i onClick={goBack} className="bi bi-arrow-left "></i>
                    <input type="text" className='Message-User-input' placeholder='Message-User' />
                </div>
            </div>

            <div className="Message-user-List">


                <h3>Find Friend</h3>
                <Flickity
                    className={'carousel'} // default ''
                    elementType={'div'} // default 'div'
                    options={flickityOptions} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                    reloadOnUpdate // default false
                    static // default false
                >
                    {
                        api.map((item) => {
                            return (
                                <>
                                    <img src={item.PhotoUrl} className='userimg' alt="" />
                                </>
                            )
                        })
                    }


                </Flickity>
                
                <h3>Online</h3>
                <Flickity
                    className={'carousel'} // default ''
                    elementType={'div'} // default 'div'
                    options={flickityOptions} // takes flickity options {}
                    disableImagesLoaded={false} // default false
                    reloadOnUpdate // default false
                    static // default false
                >
                    {
                        api.map((item) => {
                            return (
                                <>
                                    <img src={item.PhotoUrl} className='userimg' alt="" />
                                </>
                            )
                        })
                    }


                </Flickity>


                <h3>Messages</h3>
                <div className="Message-user-container">
                    <div className="Message-profile-div">
                        <img src="https://cdn.britannica.com/47/188747-050-1D34E743/Bill-Gates-2011.jpg" className='Message-profile-img' alt="" />
                        <div className="Message-Profile-name">
                            Bill Gates
                        </div>
                    </div>
                </div>

            </div>

            <div className="Message-user-bottom">

            </div>
        </>
    )
}

export default Message
