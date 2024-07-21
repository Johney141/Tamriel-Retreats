import './DeleteSpot.css'
import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import { deleteSpotThunk } from "../../store/spots";



const DeleteSpotModal = ({spotId, spotDeleted}) => {
    const { closeModal } = useModal();
    const dispatch = useDispatch();


    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(deleteSpotThunk(spotId))
            .then(() => {
                spotDeleted();
                closeModal();
            })

    }

    return (
        <div className="delete-spot-container">
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button 
                className="delete-button"
                onClick={(e) => handleDelete(e)}>Yes (Delete Spot)</button>
            <button 
                className="keep-button"
                onClick={closeModal}
            >No (Keep Spot)</button>
        </div>
    )
}

export default DeleteSpotModal;