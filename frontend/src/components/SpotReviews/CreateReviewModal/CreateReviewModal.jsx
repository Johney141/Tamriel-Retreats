import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { addReviewThunk } from "../../../store/reviews";


const CreateReviewModal = ({spotId}) => {
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [reviewErrors, setReviewErrors] = useState({})

    const dispatch = useDispatch();
    const {closeModal} = useModal();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const reviewBody = {
            review,
            stars
        };
        setReviewErrors({});

        const reviewData = await dispatch(addReviewThunk(reviewBody, spotId));
        let errors = {};
        if(reviewData.message) {
            errors = {...reviewData.message};
            setReviewErrors({...reviewData.message})
        }

        if(!Object.keys(errors).length) {
            closeModal()
        }


    }

    return (
        <div>
            <h1>How was your stay?</h1>
            {reviewErrors.message ? 
                <p className="error">Review already exists for this spot</p> :
                null}
            <textarea 
                id="reviewText"
                onChange={e => setReview(e.target.value)}
                value={review}
                placeholder="Leave your review here"
            ></textarea>
            <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        onClick={() => setStars(star)}
                        onMouseEnter={() => setHover(star)}
                        onMouseLeave={() => setHover(0)}
                        style={{ cursor: 'pointer' }}
                    >
                        {star <= (hover || stars) ? <FaStar /> : <FaRegStar />}
                    </span>
                ))}
            </div>
            <button
                disabled={review.length < 10 || stars < 1 ? true : false}
            >
                Submit Your Review
            </button>
        </div>
    );
}

export default CreateReviewModal;