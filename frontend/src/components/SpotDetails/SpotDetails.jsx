import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../store/spots";
import SpotDetailImages from "./SpotDetailImages/SpotDetailImages";
import { CiStar } from "react-icons/ci";
import './SpotDetails.css';
import { getReviewsThunk } from "../../store/reviews";
import SpotReviews from "../SpotReviews/SpotReviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import CreateReviewModal from "../SpotReviews/CreateReviewModal/CreateReviewModal";


const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams();
    const userId = useSelector(state => state.session.user.id)
    const spot = useSelector(state => state.spotState.byId[spotId]);
    const reviews = useSelector(state => state.reviewState.allReviews);

    const dispatch = useDispatch();

    useEffect(() => {
        const loadData = async () => {
            await dispatch(fetchSpot(spotId));
            await dispatch(getReviewsThunk(spotId));
            setIsLoaded(true);
        }

        if(!isLoaded) {
            loadData();
        }
        
    }, [isLoaded, dispatch, spotId])

    const handleBooking = () => {
        window.alert('Feature Coming Soon')
    }
    
    // console.log(spot)
    if(!isLoaded){
        return (
            <h1>loading placeholder</h1>
        )
    } else {
        return (
            <div className="detail-container">  
                <header className="spot-detail-header">
                    <h1 id="spotTitle">{spot.name}</h1>
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
                                {spot.numReviews === null ? 
                                    <>
                                        <CiStar />
                                        <h3>New</h3>

                                    </>
                                : 
                                    <>
                                        <CiStar /> 
                                        <h3 id="avgRating">{spot.avgStarRating} </h3>
                                        <h3>| {spot.numReviews === 1 ? `1 review`: `${spot.numReviews} reviews`}</h3>
                                    </>}
                            </div>
                        </div>
                        <button id="bookingButton" onClick={handleBooking}>Reserve</button>
                    </div>
                </main>
                <footer className="reviews">
                                                
                    <div className="review-header">
                    {spot.numReviews === null ? 
                        <>
                            <CiStar />
                            <h3>New</h3>
                            {spot.ownerId !== userId ? 
                                <button>
                                    Post Your Review
                                </button> : null}
                        </>
                    : 
                        <>
                            <CiStar /> 
                            <h3 id="avgRating">{spot.avgStarRating} | {spot.numReviews === 1 ? `1 review`: `${spot.numReviews} reviews`}</h3>

                            {spot.ownerId !== userId ?
                            <div>
                                <OpenModalButton 
                                    buttonText={'Post Your Review'}
                                    modalComponent={<CreateReviewModal spotId={spot.id}/>}
                                />
                            </div> : null}
                        </>}
                    </div>
                    <SpotReviews reviews={reviews} />
                
                </footer>
            </div>
        )
    }
    
}

export default SpotDetails