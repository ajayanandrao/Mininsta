import React, { useEffect, useState } from 'react'
import "./Movies.scss";
import Flickity from 'react-flickity-component';
import mapi from "./m.json";
import trailer from "./trailer.json";
import holly from "./hollywood.json";
import bolly from "./bollywood.json";
import { Link } from 'react-router-dom';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../Firebase';

const Movies = () => {
    var flickityOptions = {
        initialIndex: 0,
        wrapAround: true,
        autoPlay: 2000
    }
    var hollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2500
    }
    var bollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2000
    }

    const [users, setUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'MovieCat'));
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setUsers(userList);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    const [movieTrailer, setMovieTrailer] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'MovieTrailers'));
                const userList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setMovieTrailer(userList);
            } catch (error) {
                console.log('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    return (
        <>

            <div className='movie-main-container'>
                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}>
                    {movieTrailer.map((trailer) => {
                        return (
                            <>
                                <Link to={`/movieTrailer/${trailer.id}`}>
                                    <div style={{ backgroundImage: `url(${trailer.img})` }} className="mover-trailer-card">

                                        <div className="trailer-data-div">
                                            <div className='trailer-name'>{trailer.name}</div>
                                            <div className='trailer-name sub'>{trailer.subname}</div>
                                        </div>
                                    </div>
                                </Link>
                            </>
                        )
                    })}

                </Flickity>


                <div className="category-grid-center">
                    <div className="categaory-container">

                        {users.map((movie) => {
                            return (
                                <>
                                    <Link to={`/movie/${movie.id}`}>
                                        <div className="category-card-div" key={movie.id}>
                                            <div style={{ backgroundImage: `url(${movie.img})` }} className="category-card">
                                                {movie.name}
                                            </div>
                                        </div>
                                    </Link>
                                </>
                            )
                        })}

                    </div>
                </div>

                <div className="category-div">Hollywood <div className="see-more">more</div></div>

                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={hollywood}
                    disableImagesLoaded={false}>

                    {holly.map((holly) => {
                        return (
                            <>
                                <div style={{ backgroundImage: `url(${holly.img})` }} className="hollywood-card">

                                </div>
                            </>
                        )
                    })}

                </Flickity>

                <div className="category-div">Bollywood <div className="see-more">more</div></div>

                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={bollywood}
                    disableImagesLoaded={false}>

                    {bolly.map((holly) => {
                        return (
                            <>
                                <div style={{ backgroundImage: `url(${holly.img})` }} className="hollywood-card">

                                </div>
                            </>
                        )
                    })}

                </Flickity>
            </div>
        </>
    )
}

export default Movies
