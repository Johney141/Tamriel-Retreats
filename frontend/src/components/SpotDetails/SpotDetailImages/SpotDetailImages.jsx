import './SpotDetailImages.css'

const SpotDetailImages = ({images}) => {
    const previewImage = images.filter(image => image.isPreview)
    const previewImageUrl = previewImage[0].url;
    const spotImages = images.filter(image => !image.isPreview);


    return(
        <div className='detail-image'>
            <div >
                <img src={previewImageUrl} id='preview-image' />
            </div>
            <div className="spot-images-container">
                {spotImages.map(image => (
                    <div key={image.id}>
                        <img src={image.url} alt="" className='spot-images' />
                    </div>
                ))}
            </div>
            
        </div>
    )
}

export default SpotDetailImages