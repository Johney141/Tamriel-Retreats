import { csrfFetch } from "./csrf"

const GET_REVIEWS = 'reviews/getReviews';

const getReviews = (reveiws) => ({
    type: GET_REVIEWS,
    payload: reveiws
})

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
        default: 
            return state;
    }
}

export default reviewsReducer;