import { csrfFetch } from "./csrf"

const GET_SPOTS = 'spots/getSpots';


const getSpots = (spots) => {
    return {
        type: GET_SPOTS,
        payload: spots
    }
}




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
            console.log(action.payload.Spots)
            newState.allSpots = action.payload.Spots;

            // byId
            for (let spot of action.payload.Spots) {
                newState.byId[spot.id] = spot;
            }
            return newState;
        default: 
            return state
    }
}

export default spotReducer





