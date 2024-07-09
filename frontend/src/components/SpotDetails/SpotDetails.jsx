import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSpot } from "../../store/spots";
import SpotDetailImages from "./SpotDetailImages/SpotDetailImages";


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
    
    console.log(spot)
    if(!isLoaded){
        return (
            <h1>loading placeholder</h1>
        )
    } else {
        return (
            <>
                <header>
                    <h1>{spot.name}</h1>
                    <h4>{`${spot.city}, ${spot.state}, ${spot.country}`}</h4>
                </header>
                <SpotDetailImages images={spot.SpotImages} />
                <main>
                    <h2>Hosted by {`${spot.Owner.firstName} ${spot.Owner.lastName}`}</h2>
                    <p>{spot.description}</p>
                </main>
            </>
        )
    }
    
}

export default SpotDetails