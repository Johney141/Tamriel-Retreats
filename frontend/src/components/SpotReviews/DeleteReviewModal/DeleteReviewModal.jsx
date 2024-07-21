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
            <p>Are you sure you want to delete this review?</p>
            <button 
                className="delete-button"
                onClick={(e) => handleDelete(e)}>Yes (Delete Review)</button>
            <button 
                className="keep-button"
                onClick={closeModal}
            >No (Keep Review)</button>
        </div>
    )
}

export default DeleteReviewModal;