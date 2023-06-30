import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import mapi from "./../m.json";
import { CircularProgress } from '@mui/material';

const CategoryParam = () => {
    const { id } = useParams();
    const movie = mapi.find(item => item && item.id === id);

    console.log(movie.id)

    // if (!movie) {
    //     return <>
    //         <div className='skeleton-center'>
    //             <CircularProgress className='circularprogress' /> <span className='loadinga'> Loading... </span>
    //         </div >
    //     </>;
    // }

    return (
        <>
            hello
        </>
    )
}

export default CategoryParam
