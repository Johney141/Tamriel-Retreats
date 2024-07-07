import { useState } from "react"
import { useParams } from "react-router-dom";


const SpotDetails = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const { spotId } = useParams();

    return (
        <h1>placeholder</h1>
    )
}

export default SpotDetails