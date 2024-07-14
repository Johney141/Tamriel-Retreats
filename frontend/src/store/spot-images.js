import { csrfFetch } from "./csrf";

const ADD_SPOT_IMAGE = 'spotImage/addSpotImage';

const addSpotImage = (spotImg) => ({
    type: ADD_SPOT_IMAGE,
    payload: spotImg
})



export const addSpotImageThunk = (spotImg, spotId) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify(spotImg)
        };
        const res = await csrfFetch(`/api/spots/${spotId}/images`, options);
        
        if(res.ok) {
            const data = await res.json();
            dispatch(addSpotImage(data));
            console.log(data)
            return data;
        } else {
            const err = await res.json();
            throw err
        } 

    } catch (error) {
        let err = await error.json();
        return err;
    }
};

const initialState = {
    allSpotImages: [],
    byId: {}
}

const spotImageReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case ADD_SPOT_IMAGE:
            newState = {...state};
            newState.allSpotImages = [...newState.allSpotImages, action.payload];
            newState.byId = {...newState.byId, [action.payload.id]: action.payload}
            return newState
        default: {
            return state;
        }
    }
}

export default spotImageReducer