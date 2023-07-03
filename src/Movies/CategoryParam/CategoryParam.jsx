import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import mapi from "./../m.json";
import { CircularProgress } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../Firebase';

const CategoryParam = () => {
    const { id } = useParams();
    const [movieCat, MovieCat] = useState(null);
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

    return (
        <>
            {movieCat.name}
        </>
    )
}

export default CategoryParam
