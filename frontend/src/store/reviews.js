import { csrfFetch } from "./csrf"

const GET_REVIEWS = 'reviews/getReviews';
const ADD_REVIEW = 'reviews/addReview';

const getReviews = (reveiws) => ({
    type: GET_REVIEWS,
    payload: reveiws
})

const addReview = (review) => ({
    type: ADD_REVIEW,
    payload: review
});

export const getReviewsThunk = (spotId) => async (dispatch) => {
    try {
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`);
        if(res.ok) {
            const data = await res.json();

            dispatch(getReviews(data))
        } else {
            throw res
        }
    } catch (error) {
        return error
    }
};

export const addReviewThunk = (reviewBody, spotId) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: {"Content-Type": 'application/json'},
            body: JSON.stringify(reviewBody)
        };
        
        const res = await csrfFetch(`/api/spots/${spotId}/reviews`, options);

        if(res.ok) {
            const review = await res.json();
            dispatch(addReview(review))
            return review;
        } else {
            throw res;
        }
        
    } catch (error) {
        const parsedError = await error.json();
        return parsedError;
    }
} 


let initialState = {
    allReviews: [],
    byId: {}
}

const reviewsReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case GET_REVIEWS:
            newState = {...state};
            
            newState.allReviews = action.payload.Reviews;

            for(let review of action.payload.Reviews) {
                newState.byId[review.id] = review;
            }

            return newState;

        case ADD_REVIEW: 
            newState = {...state};

            newState.allReviews = [...newState.allReviews, action.payload];

            newState.byId = {...newState.byId, [action.payload.id]: action.payload}

            return newState;
        default: 
            return state;
    }
}

export default reviewsReducer;