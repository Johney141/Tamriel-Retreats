import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateSpotThunk } from '../../store/spots';
import { addSpotImageThunk, deleteSpotImageThunk } from '../../store/spot-images';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchSpot } from '../../store/spots';


const UpdateSpot = () => {
    const { spotId } = useParams();
    const spot = useSelector(state => state.spotState.byId[spotId]);
    const [isLoaded, setIsLoaded] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [preview, setPreview] = useState('');
    const [photo1, setPhoto1] = useState('');
    const [photo2, setPhoto2] = useState('');
    const [photo3, setPhoto3] = useState('');
    const [photo4, setPhoto4] = useState('');
    const [spotValidationErrors, setSpotValidationErrors] = useState({});
    const [imgValidationErrors, setImgValidationErrors] = useState({});

    useEffect(() => {
        const getSpot = async () => {
            await dispatch(fetchSpot(spotId));
            setIsLoaded(true);
        };

        if (!isLoaded) {
            getSpot();
        }
    }, [isLoaded, dispatch, spotId]);

    useEffect(() => {
        if (spot) {
            setCountry(spot.country || '');
            setAddress(spot.address || '');
            setCity(spot.city || '');
            setState(spot.state || '');
            setDescription(spot.description || '');
            setName(spot.name || '');
            setPrice(spot.price || '');
        }
        
        if (isLoaded && spot && spot.SpotImages) {
            setPreview(spot.SpotImages[0]?.url || '');
            setPhoto1(spot.SpotImages[1]?.url || '');
            setPhoto2(spot.SpotImages[2]?.url || '');
            setPhoto3(spot.SpotImages[3]?.url || '');
            setPhoto4(spot.SpotImages[4]?.url || '');
        }
    }, [spot, isLoaded]);


    
    // console.log(country, address, city, state, description, name, price, preview, photo1,photo2,photo3,photo4)

    

    const handleSubmit = async (e) => {
        e.preventDefault();
    

        const spotBody = {
            address,
            city,
            state,
            country,
            lat: '15.0000001',
            lng: '70.0000002',
            name,
            description,
            price
        };
        console.log(spotBody)
    
        setSpotValidationErrors({});
        setImgValidationErrors({});
        console.log("Errors Cleared: ", spotValidationErrors, imgValidationErrors);
    
      
        const spotData = await dispatch(updateSpotThunk(spotBody, spotId));
        
        console.log('Response: ',spotData)
        
        let spotErrors = {}
        if(spotData.errors) {
            spotErrors = {...spotData.errors}
            setSpotValidationErrors({...spotData.errors})
        }
    
 
        const images = [
            { url: preview, isPreview: true, photo: 'preview', imgId: spot?.SpotImages[0]?.id || null },
            { url: photo1, isPreview: false, photo: 'photo1', imgId: spot?.SpotImages[1]?.id || null },
            { url: photo2, isPreview: false, photo: 'photo2', imgId: spot?.SpotImages[2]?.id || null },
            { url: photo3, isPreview: false, photo: 'photo3', imgId: spot?.SpotImages[3]?.id || null },
            { url: photo4, isPreview: false, photo: 'photo4', imgId: spot?.SpotImages[4]?.id || null },
        ];
    
      
        const imageErrors = {};
        for (let image of images) {
            if (image.isPreview && !image.url) {
                imageErrors.preview = "Preview image is required";
            } else if (image.url.length && !(image.url.endsWith('.png') || image.url.endsWith('.jpg') || image.url.endsWith('.jpeg'))) {
                imageErrors[image.photo] = "Image URL must end in .png, .jpg, or .jpeg";
            } else if (image.url && image.imgId) {
                await dispatch(deleteSpotImageThunk(image.imgId));
                await dispatch(addSpotImageThunk(image, spotId));
            } else if (image.url) {
                await dispatch(addSpotImageThunk(image, spotId));
            }
        }
    
       
        if (Object.keys(imageErrors).length) {
            setImgValidationErrors(imageErrors);
        }
    
      
        if (!Object.keys(spotErrors).length && !Object.keys(imageErrors).length) {
            navigate(`/spots/${spotId}`);
        }
    };
    
    // console.log(spotValidationErrors)
    return (
        <div className="spot-form-container">
            <div>
                <h1>Update your Spot</h1>
                <h4>Where&apos;s your place located?</h4>
                <p>Guests will only get your exact address once they booked a reservation.</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className='input-container'>
                    <div className='label-container'>
                        <label>Country</label>
                        {spotValidationErrors.country ? <p className='error'
                        >{spotValidationErrors.country}
                        </p> : null}
                    </div>
                    <input 
                        type="text"
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder='Country'
                        value={country}
                    />
                </div>
                <div className='input-container'>
                    <div className='label-container'>
                        <label>Street Address</label>
                        {spotValidationErrors.address ? <p className='error'
                        >{spotValidationErrors.address}
                        </p> : null}
                    </div>
                    <input 
                        type="text"
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder='Address'
                        value={address}
                    />      
                </div>
                <div className='city-state'>
                    <div className='input-container'>
                        <div className='label-container'>
                            <label>City</label>
                            {spotValidationErrors.city ? <p className='error'
                            >{spotValidationErrors.city}
                            </p> : null}
                        </div>
                        <input 
                            type="text" 
                            onChange={(e) => setCity(e.target.value)}
                            placeholder='City'
                            value={city}
                        />
                    </div>
                    <div className='input-container'>
                        <div className='label-container'>
                            <label>State</label>
                            {spotValidationErrors.state ? <p 
                                className='error'
                            >{spotValidationErrors.state}
                            </p> : null}
                        </div>
                        <input 
                            type="text" 
                            onChange={(e) => setState(e.target.value)}
                            placeholder='State'
                            value={state}
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
                    {spotValidationErrors.description ? <p className='error'
                    >{spotValidationErrors.description}
                    </p>: null}
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
                    {spotValidationErrors.name ? <p className='error'
                    >{spotValidationErrors.name}
                    </p> : null}
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
                    {spotValidationErrors.price ? <p className='error'
                    >{spotValidationErrors.price}
                    </p> : null}
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
                    {imgValidationErrors.preview ? <p className='error'
                    >{imgValidationErrors.preview} 
                    </p> : null}
                    {imgValidationErrors.image ? <p className='error'
                    >{imgValidationErrors.image}
                    </p> : null}
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto1(e.target.value)}
                        placeholder='Image URL'
                        value={photo1}
                    />
                    {imgValidationErrors.photo1 ? <p className='error'
                    >{imgValidationErrors.photo1}
                    </p> : null}
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto2(e.target.value)}
                        placeholder='Image URL'
                        value={photo2}
                    />
                    {imgValidationErrors.photo2 ? <p className='error'
                    >{imgValidationErrors.photo2}
                    </p> : null}
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto3(e.target.value)}
                        placeholder='Image URL'
                        value={photo3}
                    />
                    {imgValidationErrors.photo3 ? <p className='error'
                    >{imgValidationErrors.photo3}
                    </p> : null}
                    <input 
                        type="text" 
                        onChange={(e) => setPhoto4(e.target.value)}
                        placeholder='Image URL'
                        value={photo4}
                    />
                    {imgValidationErrors.photo4 ? <p className='error'
                    >{imgValidationErrors.photo4}
                    </p> : null}
                </div>
                <button type='submit'>Update Spot</button>

            </form>
        </div>
    )
}

export default UpdateSpot;