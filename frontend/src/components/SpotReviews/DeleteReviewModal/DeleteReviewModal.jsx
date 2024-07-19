import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReveiwThunk } from "../../../store/reviews";
import './DeleteReviewModal.css'


const DeleteReviewModal = ({reviewId, reviewDeleted}) => {
    const {closeModal} = useModal();
    const dispatch = useDispatch();

    const handleDelete = (e) => {
        e.preventDefault();
        e.stopPropagation();

        dispatch(deleteReveiwThunk(reviewId))
            .then(() => {
                reviewDeleted();
                closeModal();
            })

    }

    return (
        <div className="delete-review-container">
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

export default DeleteReviewModal;