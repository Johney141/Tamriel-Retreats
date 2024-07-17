import { useEffect } from "react";
import './DeleteSpot.css'


const DeleteSpotModal = () => {
    const

    const handleDelete = (e) => {
        e.preventDefault;
        e.stopPropagation;

    }

    return (
        <div className="delete-spot-container">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button className="delete-button">Yes (Delete Spot)</button>
            <button className="keep-button">No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;