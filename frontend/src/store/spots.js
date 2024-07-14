import { csrfFetch } from "./csrf"

const GET_SPOTS = 'spots/getSpots';
const GET_ONE_SPOT = 'spots/getSpot';
const ADD_SPOT = 'spots/addSpot';



const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots
    }
}

const getSpot = (spot) => {
    return {
        type: GET_ONE_SPOT,
        payload: spot
    }
}

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        payload: spot
    }
}


// Get All Spots
export const fetchSpots = () =>  async (dispatch) =>{
    try {
        const res = await csrfFetch("/api/spots");
        if(res.ok) {
            const spots = await res.json();
            dispatch(getSpots(spots));
        } else {
            throw res
        }
    } catch (error) {
        return error
    }
}

// Get one spot
export const fetchSpot = (spotId) => async (dispatch) => {
    try {
        console.log('testing')
        const res = await csrfFetch(`/api/spots/${spotId}`)
        if(res.ok) {
            const spot = await res.json();
            dispatch(getSpot(spot))
        } else {
            throw res
        }
    } catch (error) {
        return error
    }
};

// Create Spot 
export const addSpotThunk = (spotBody) => async (dispatch) => {
    try {
        const options = {
            method: 'POST',
            header: {'Content-Type': 'application/json'},
            body: JSON.stringify(spotBody)
        }

        const res = await csrfFetch('/api/spots', options);

        if(res.ok) {
            const spot = await res.json();
            dispatch(addSpot(spot))
            return spot;
        } else {
            const err = await res.json();
            throw err;
        }
    } catch (error) {
        const err = await error.json();
        return err 
    }
}


const initialState = {
    allSpots: [],
    byId: {}
};

const spotReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case GET_SPOTS:
            newState = {...state};
            // All Spots
            newState.allSpots = action.payload.Spots;

            // byId
            for (let spot of action.payload.Spots) {
                newState.byId[spot.id] = spot;
            }
            return newState;
        case GET_ONE_SPOT:
            newState = {...state};
            newState.byId[`${action.payload.id}`] = action.payload
            
            return newState;
        case ADD_SPOT: 
            newState = {...state}; 

            newState.allSpots = [...newState.allSpots, action.payload];

            newState.byId ={...newState.byId, [action.payload.id]: action.payload}

            return newState;
        default: 
            return state
    }
}

export default spotReducer





