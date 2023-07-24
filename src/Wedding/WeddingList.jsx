import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { db } from '../Firebase';
import { AuthContext } from '../AuthContaxt';
import "./WeddingList.scss";
import { FaMobile } from "react-icons/fa"
import { MdWork } from "react-icons/md"
import { ImLocation } from "react-icons/im"
import { Link } from 'react-router-dom';
import { CgClose } from 'react-icons/cg'

const WeddingList = () => {

    const { currentUser } = useContext(AuthContext);
    const dataRef = collection(db, 'WeddingDatabase');
    const [weddingList, setWeddingList] = useState([]);
    const q = query(dataRef, orderBy('time', 'desc'));
    useEffect(() => {
        const unsub = onSnapshot(q, (snapshot) => {
            setWeddingList(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
        return unsub;
    }, []);

    const handleDeleteItem = async (id) => {
        const dataRef = doc(db, 'WeddingDatabase', id);
        await deleteDoc(dataRef);
    }


    return (
        <div>
            {weddingList.map((item) => {
                const canDelete = currentUser && currentUser.uid === item.uid;
                return (
                    <div className='my-4' key={item.id}>

                        <div className="weddingList-card-container">
                            <div className="weddingList-sender-div">
                                <img src={item.photoURL} className='weddingList-sender-photo' alt="" />
                                <span style={{ textTransform: "capitalize" }}>{item.displayName}</span>

                                {canDelete && (
                                    <div className='weddingList-delete-div' >
                                        <CgClose onClick={() => handleDeleteItem(item.id)} />
                                    </div>
                                )}
                            </div>
                            <Link to={`/WeddingList/${item.id}`}>
                                <div className="weddingList-profile-div">
                                    <div className='d-flex'>
                                        <img src={item.photoOne} className='weddingList-photo' alt="" />

                                        <div className="weddingList-about-div">
                                            <div className='d-flex' style={{ textTransform: "capitalize", fontSize: "24px", fontWeight: "600" }}>
                                                <div className='me-1'>{item.first}</div>
                                                <div>{item.last}</div>
                                            </div>

                                            <div className="weddingList-about-inner-div">
                                                <div className="weddingList-about-inner-item">
                                                    <FaMobile style={{ fontSize: "24px", color: "#ccc", marginRight: "0.5rem" }} />
                                                    <span> {item.mobile} </span>
                                                </div>
                                                <div className="weddingList-about-inner-item">
                                                    <MdWork style={{ fontSize: "24px", color: "#ccc", marginRight: "0.5rem" }} />
                                                    <span > {item.work} </span>
                                                </div>
                                                <div className="weddingList-about-inner-item">
                                                    <ImLocation style={{ fontSize: "24px", color: "#ccc", marginRight: "0.5rem" }} />
                                                    <span > {item.village} </span>
                                                    <span className='ms-1'> {item.state} </span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </Link>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default WeddingList
