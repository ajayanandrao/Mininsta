import React from 'react'
import "./Wedding.scss";
import { Link } from 'react-router-dom';
import WeddingList from './WeddingList';

const WeddingMain = () => {
    return (
        <>
            <WeddingList />
            <Link to={"/AddWedding/"}>
                <div className='w-create-bio-btn'>+</div>
            </Link>
            <div className='w-up-bio-btn'>^</div>
        </>
    )
}

export default WeddingMain
