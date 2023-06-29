import React, { useEffect, useState } from 'react'
import "./Movies.scss";
import Flickity from 'react-flickity-component';
import mapi from "./m.json";
import trailer from "./trailer.json";
import holly from "./hollywood.json";
import bolly from "./bollywood.json";
import { Link } from 'react-router-dom';

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



    return (
        <>

            <div className='movie-main-container'>
                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}>
                    {trailer.map((trailer) => {
                        return (
                            <>
                                <div style={{ backgroundImage: `url(${trailer.img})` }} className="mover-trailer-card">

                                    <div className="trailer-data-div">
                                        <div className='trailer-name'>{trailer.name}</div>
                                        <div className='trailer-name sub'>{trailer.subname}</div>
                                    </div>

                                </div>
                            </>
                        )
                    })}

                </Flickity>


                <div className="category-grid-center">
                    <div className="categaory-container">

                        {mapi.map((movie) => {
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
