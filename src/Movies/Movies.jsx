import React from 'react'
import "./Movies.scss";
import Flickity from 'react-flickity-component';
import mapi from "./m.json";
import { Link } from 'react-router-dom';

const Movies = () => {
    var flickityOptions = {
        initialIndex: 2,
        wrapAround: true,
        autoPlay: 1500
    }
    var hollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2000
    }
    var bollywood = {
        initialIndex: 1,
        wrapAround: true,
        autoPlay: 2500
    }

    return (
        <>
            <div className='movie-main-container'>
                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={flickityOptions}
                    disableImagesLoaded={false}>

                    <div className="mover-trailer-card">1</div>
                    <div className="mover-trailer-card">2</div>
                    <div className="mover-trailer-card">3</div>
                    <div className="mover-trailer-card">4</div>
                    <div className="mover-trailer-card">5</div>

                </Flickity>

                <div className="category-div">Categary</div>

                <div className="category-grid-center">
                    <div className="categaory-container">

                        {mapi.map((movie) => {
                            return (
                                <>
                                    <Link to={`/movie/${movie.id}`}>
                                        <div className="category-card-div" key={movie.id}>
                                            <div className="category-card">{movie.id}</div>
                                            <div className="category-name">{movie.name}</div>
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

                    <div className="hollywood-card">1</div>
                    <div className="hollywood-card">2</div>
                    <div className="hollywood-card">3</div>
                    <div className="hollywood-card">4</div>
                    <div className="hollywood-card">6</div>
                    <div className="hollywood-card">7</div>
                    <div className="hollywood-card">8</div>

                </Flickity>

                <div className="category-div">Bollywood <div className="see-more">more</div></div>

                <Flickity
                    className='carouse'
                    elementType={'div'}
                    options={bollywood}
                    disableImagesLoaded={false}>

                    <div className="hollywood-card">1</div>
                    <div className="hollywood-card">2</div>
                    <div className="hollywood-card">3</div>
                    <div className="hollywood-card">4</div>
                    <div className="hollywood-card">6</div>
                    <div className="hollywood-card">7</div>
                    <div className="hollywood-card">8</div>

                </Flickity>
            </div>
        </>
    )
}

export default Movies
