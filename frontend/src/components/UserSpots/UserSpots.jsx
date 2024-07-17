import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchUserSpots } from "../../store/spots"; 
import { CiStar } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";

const UserSpots = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const spots = useSelector(state => state.spotState.allSpots);
    const [spotDeleted, setSpotDeleted] = useState(false);
    const orderedSpots = spots.toReversed();
    const navigate = useNavigate();


    const dispatch = useDispatch();

    useEffect(() => {
        const getUserSpots = async () => {
            await dispatch(fetchUserSpots())
            setIsLoaded(true);
        }

        if(!isLoaded) {
            getUserSpots();
        }

        if(spotDeleted) {
            getUserSpots();
            setSpotDeleted(false);
        }
    }, [isLoaded, spotDeleted, dispatch])

    const handleSpotDeleted = () => {
        setSpotDeleted(true);
    }


    return (
        <>
        <div>
            <h1>Manage Your Spots</h1>
            <button
            onClick={() => navigate('/spots/create-a-spot')}
            >Create a New Spot</button>
        </div>
        <div className="landing-container">
            
            {orderedSpots.map(spot => (
                <div 
                    key={spot.id} 
                    className="spot-container" 
                    
                    >
                    <div onClick={() => navigate(`/spots/${spot.id}`)}>
                    
                    
                    <img src={spot.previewImage} alt={spot.name} className="card-image"/>
                    <div className="card-title">
                        <p>{spot.city}, {spot.state}</p>
                        <div className="star-rating">
                            <CiStar />
                            <p>{spot.avgRating}</p>
                        </div>
                    </div>
                    <p className="pricing"><b>${spot.price}</b>/night</p>
                    </div>
                    <div>
                        <button>Update</button>
                        <OpenModalButton                 
                            buttonText="Delete"
                            modalComponent={<DeleteSpotModal spotId={spot.id} spotDeleted={handleSpotDeleted}/>}/>
                    </div>
            </div>
            ))}

        </div>
        </>
    )
    
}

export default UserSpots