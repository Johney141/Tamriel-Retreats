import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots";
import { CiStar } from "react-icons/ci";
import Lottie from 'react-lottie';
import animationData from '../../loading.json';

import './LandingPage.css'
import { useNavigate } from "react-router-dom";


const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const spots = useSelector(state => state.spotState.allSpots);
    const navigate = useNavigate();
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
    };
    


    const dispatch = useDispatch();

    useEffect(() => {
        const getSpots = async () => {
            await dispatch(fetchSpots())
            setIsLoaded(true);
        }

        if(!isLoaded) {
            getSpots();
        }
    }, [isLoaded, dispatch])


    if(!isLoaded) {
        return(
            <Lottie 
            options={defaultOptions}
            height={400}
            width={400}
        />)
    }

    return(
        <>
        <div className="landing-container">
            {spots.map(spot => (
                
                <div key={spot.id} className="spot-container" onClick={() => navigate(`/spots/${spot.id}`)}>
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
            ))}
            
        </div>
        </>
    )
}

export default LandingPage