import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import "./AddHollywood.scss";
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../Firebase';
import { CircularProgress } from '@mui/material';

const AddHollywood = () => {

    const { id } = useParams();
    const [movieCat, MovieCat] = useState(null);
    const [name, setName] = useState("");
    const [subName, setSubName] = useState("");
    const [img, setImg] = useState(null);
    const [trailer, setTrailer] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userDocRef = doc(db, 'MovieCat', id);
                const userDocSnapshot = await getDoc(userDocRef);
                if (userDocSnapshot.exists()) {
                    MovieCat({ id: userDocSnapshot.id, ...userDocSnapshot.data() });
                } else {
                    console.log('No such document!');
                }
            } catch (error) {
                console.log('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [id]);

    if (!movieCat) {
        return <>
            <div className='skeleton-center'>
                <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
            </div >
        </>;
    }

    const Save = async () => {
        const movieRef = collection(db, "MovieCat", id, "Hollywood");
        await addDoc(movieRef, {
            name: name,
        });
    };




    return (
        <>
            <div className='add-holy-container'>
                <input type="text" placeholder='name' onChange={(e) => setName(e.target.value)} />
                <input type="text" placeholder='sub name' onChange={(e) => setSubName(e.target.value)} />
                <label htmlFor="">
                    <input type="file" placeholder='img' onChange={(e) => setImg(e.target.files[0])} />
                    image
                </label>

                <label htmlFor="">
                    <input type="file" placeholder='trailer' onChange={(e) => setName(e.target.files[0])} />
                    trailer
                </label>
                <button className='btn btn-info' onClick={Save}>save</button>
            </div>
        </>
    )
}

export default AddHollywood
