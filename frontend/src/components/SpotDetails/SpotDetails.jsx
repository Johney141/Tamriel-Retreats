import { useEffect, useState } from "react"
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";


const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams();

    const dispatch = useDispatch();

    useEffect(() => {
        
    })

    return (
        <h1>placeholder</h1>
    )
}

export default SpotDetails