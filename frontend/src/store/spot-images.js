import { csrfFetch } from "./csrf";

const ADD_SPOT_IMAGE = 'spotImage/addSpotImage';
const DELETE_SPOT_IMAGE = 'spotImage/deleteSpotImage';

const addSpotImage = (spotImg) => ({
    type: ADD_SPOT_IMAGE,
    payload: spotImg
})

const deleteSpotImage = (spotImg) => ({
    type: DELETE_SPOT_IMAGE,
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

export const deleteSpotImageThunk = (imageId) => async (dispatch) => {
    try {
        const options = {
            method: 'DELETE',
            header: {'Content-Type': 'application/json'}
        }
        const res = await csrfFetch(`/api/spot-images/${imageId}`, options)

        

        if(res.ok) {
            const data = await res.json();
            console.log('image deleted')
            dispatch(deleteSpotImage(data));
        } else {
            throw res
        }
    } catch (error) {
        return error
    }
}

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

        case DELETE_SPOT_IMAGE: 
            newState = {...state};

            newState.allSpotImages = newState.allSpotImages.filter(spotImage => {
                spotImage.id !== action.payload.id;
            });

            delete newState.byId[action.payload.id];
            
            return newState;
        default: {
            return state;
        }
    }
}

export default spotImageReducer