import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../store/spots";
import SpotDetailImages from "./SpotDetailImages/SpotDetailImages";
import { CiStar } from "react-icons/ci";
import './SpotDetails.css';


const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams();
    // const [ spot, setSpot ] = useState()
    const spot = useSelector(state => state.spotState.byId[spotId])

    const dispatch = useDispatch();

    useEffect(() => {
        const getSpot = async () => {
            await dispatch(fetchSpot(spotId));
            setIsLoaded(true);
        }

        if(!isLoaded) {
            getSpot();
        }
        
    }, [isLoaded, dispatch, spotId])

    const handleBooking = () => {
        window.alert('Feature Coming Soon')
    }
    
    console.log(spot)
    if(!isLoaded){
        return (
            <h1>loading placeholder</h1>
        )
    } else {
        return (
            <div className="detail-container">  
                <header>
                    <h1>{spot.name}</h1>
                    <h4 id="spotLocation">{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
                </header>
                <SpotDetailImages images={spot.SpotImages} />
                <main className="spot-information">
                    <div className="description">
                        <h3 id="hostedBy">Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</h3>
                        <p id="spotDescription">{spot.description}</p>
                    </div>
                    <div className="booking-container">
                        <div className="booking-info">
                            <p><b>${spot.price}</b> night</p>
                            <div className="booking-ratings">
                                <CiStar /> 
                                <p id="avgRating">{spot.avgStarRating} </p>
                                <p>| {spot.numReviews === 1 ? `1 review`: `${spot.numReviews} reviews`}</p>
                            </div>
                        </div>
                        <button id="bookingButton" onClick={handleBooking}>Reserve</button>
                    </div>
                </main>
                <footer className="reviews">
                                                
                <div className="review-header">
                        <CiStar /> 
                        <h3 id="avgRating">{spot.avgStarRating} </h3>
                        <h3>| {spot.numReviews === 1 ? `1 review`: `${spot.numReviews} reviews`}</h3>
                    </div>
                </footer>
            </div>
        )
    }
    
}

export default SpotDetails