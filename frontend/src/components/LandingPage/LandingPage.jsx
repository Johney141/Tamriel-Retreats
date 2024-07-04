import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchSpots } from "../../store/spots";


const LandingPage = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const spots = useSelector(state => state.spotState.allSpots);
    


    const dispatch = useDispatch();

    useEffect(() => {
        const getSpots = async () => {
            await dispatch(fetchSpots())
            setIsLoaded(true);
        }

        if(!isLoaded) {
            getSpots();
        }
    }, [isLoaded])

    // const spots = useSelector()

    return(
        <>
        <h1>placeholder</h1>
        {spots.map(spot => (
            <div key={spot.id} className="spot-container">
                <img src={spot.previewImage} alt={spot.name} />
                
            </div>
        ))}
        </>
    )
}

export default LandingPage