import React, { useContext, useEffect, useState } from 'react'
import "./Home.scss";
import Feed from '../Feed/Feed';
import Post from '../Post/Post';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { AuthContext } from '../AuthContaxt';
import { db } from '../Firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import FlipMove from 'react-flip-move';
import { Height } from '@mui/icons-material';
import { AiOutlineArrowUp } from "react-icons/ai";
const Home = () => {

    const [api, setApiData] = useState([]);

    const { currentUser } = useContext(AuthContext);

    const colRef = collection(db, 'AllPosts')
    const q = query(colRef, orderBy('bytime', 'desc'))
    const [docs, loading, error] = useCollectionData(q, orderBy('bytime', 'desc'))

    useEffect(() => {
        const colRef = collection(db, 'AllPosts');
        const q = query(colRef, orderBy('bytime', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedPosts = snapshot.docs.map((doc) => {
                const { name, img, postText, displayName, photoURL, bytime, uid } = doc.data();
                return { id: doc.id, name, img, postText, displayName, photoURL, bytime, uid };
            });

            setApiData(fetchedPosts);
        });

        return () => {
            unsubscribe();
        };
    }, []);


    const newData = api.map((item) => {
        return (
            <div key={item.id}>
                <Feed CurrentUser={currentUser} post={item} />
            </div>
        );
    });


    const handleScrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    return (
        <>
            <div className="btn" onClick={handleScrollToTop} id="scrollTopBtn" >
                <AiOutlineArrowUp className="top-arrow" />
            </div>
            <Post />
            <FlipMove>{newData}</FlipMove>
            <div className='height' ></div>
        </>
    )
}

export default Home
