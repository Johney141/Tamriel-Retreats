import { useState } from 'react';
import './SpotForm.css'
import { useDispatch } from 'react-redux';
import { addSpotThunk } from '../../store/spots';

const SpotForm = () => {
    const [country, setCountry] = useState();
    const [address, setAddress] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [description, setDescription] = useState();
    const [name, setName] = useState();
    const [price, setPrice] = useState();
    const [preview, setPreview] = useState();
    const [photo1, setPhoto1] = useState();
    const [photo2, setPhoto2] = useState();
    const [photo3, setPhoto3] = useState();
    const [photo4, setPhoto4] = useState();
    const [validationErrors, setValidationErrors] = useState();
    const dispatch = useDispatch();


    
    console.log(country, address, city, state, lat, lng, description, name, price, preview, photo1,photo2,photo3,photo4)

    

    const handleSubmit = (e) => {
        e.preventDefault();
        const spotBody = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }
        
        const errors = dispatch(addSpotThunk(spotBody))
        if(errors) {
            setValidationErrors(errors);
        }
        console.log(validationErrors)
    }
    
    
    return (
        <div className="spot-form-container">
            <div>
                <h1>Create a new Spot</h1>
                <h4>Where's your place located?</h4>
                <p>Guests will only get your exact address once they booked a reservation.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                    <label>Country</label>
                    <input 
                        type="text"
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country'
                        value={country}
                    />
                </div>
                <div className='input-container'>
                    <label>Street Address</label>
                    <input 
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Address'
                        value={address}
                    />      
                </div>
                <div className='city-state'>
                    <div className='input-container'>
                        <label>City</label>
                        <input 
                            type="text" 
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City'
                            value={city}
                        />
                    </div>
                    <div className='input-container'>
                        <label>State</label>
                        <input 
                            type="text" 
                            onChange={(e) => setState(e.target.value)}
                            placeholder='State'
                            value={state}
                        />
                    </div>
                </div>
                <div className='lat-lng'>
                    <div className='input-container'>
                        <label>Latitude</label>
                        <input 
                            type="text" 
                            onChange={(e) => setLat(e.target.value)}
                            placeholder='Latitude'
                            value={lat}
                        />
                    </div >
                    <div className='input-container'>
                        <label>Longitude</label>
                        <input 
                            type="text" 
                            onChange={(e) => setLng(e.target.value)}
                            placeholder='Longitude'
                            value={lng}
                        />
                    </div>
                </div>
                <div className='input-container'>
                    <h4>Describe your place to guests</h4>
                    <label>
                        Mention the best features of your space,any special amentities like
                        fast wi-fi or parking, and what you love about the neighborhood.
                    </label>
                    <textarea 
                        id='spotDescription'
                        rows={10}
                        onChange={(e) => setDescription(e.target.value)}                    
                        placeholder='Description'
                        value={description}
                    ></textarea>
                </div>
                <div className='input-container'>
                    <h4>Create a title for your Spot</h4>
                    <label>
                        Catch guests attention with a spot title that highlights with
                        what makes your place special.
                    </label>
                    <input 
                        type="text" 
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Name of your spot'
                        value={name}
                    />
                </div>
                <div className='input-container'>
                    <h4>Set a base price for your spot</h4>
                    <label>
                        Competitive pricing can help your listing stand out and rank higher in search results.
                    </label>
                    <input 
                        type="text" 
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder='Price per night (Gold)'
                        value={price}
                    />
                </div>
                <div className='input-container'>
                    <h4>Liven Up your spot with photos</h4>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input 
                        type="text" 
                        onChange={(e) => setPreview(e.target.value)}
                        placeholder='Preview Image URL'
                        value={preview}
                    />
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto1(e.target.value)}
                        placeholder='Image URL'
                        value={photo1}
                    />
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto2(e.target.value)}
                        placeholder='Image URL'
                        value={photo2}
                    />
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto3(e.target.value)}
                        placeholder='Image URL'
                        value={photo3}
                    />
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto4(e.target.value)}
                        placeholder='Image URL'
                        value={photo4}
                    />
                </div>
                <button type='submit'>Create Spot</button>

            </form>
        </div>
    )
}

export default SpotForm;