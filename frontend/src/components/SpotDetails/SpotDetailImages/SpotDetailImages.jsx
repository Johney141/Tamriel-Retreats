

const SpotDetailImages = ({images}) => {
    const previewImage = images.filter(image => image.isPreview)
    console.log(previewImage[0])

    return(
        <div>
            {images.map(image => (
                <div key={image.id}>
                    <img src={image.url} alt="" />
                </div>
            ))}
            
        </div>
    )
}

export default SpotDetailImages