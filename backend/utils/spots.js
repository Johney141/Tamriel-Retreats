const fullSpots = async (spots) => {
    let updatedSpots = []
    for(let spot of spots){
        let updatedSpot = {
            id: spot.id,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            ownerId: spot.ownerId,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
        };
        
        if(spot.Reviews.length > 0){
            // Calculate avgRating
            const reviews = spot.Reviews
            let reviewCount = reviews.length;
            let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);

            updatedSpot.avgRating = starSum / reviewCount;
        } 
        if(spot.SpotImages.length > 0){   
            // Add Preview Image
            const previewImage = spot.SpotImages[0]

            updatedSpot.previewImage = previewImage.url;

            
        }
        updatedSpots.push(updatedSpot)
    }
    return updatedSpots
}







const fullSpot = (spot) => {
    let updatedSpot = {
        id: spot.id,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        ownerId: spot.ownerId,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
    };
    if(spot.Reviews.length > 0){
        const reviews = spot.Reviews;
        const numReviews = reviews.length;
        let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = starSum / numReviews;


        updatedSpot.numReviews = numReviews;
        updatedSpot.avgStarRating = avgRating;
    } 

    if(spot.SpotImages.length > 0) {
        updatedSpot.SpotImages = spot.SpotImages;
    }
    updatedSpot.Owner = spot.Owner;



    return updatedSpot
}


module.exports = { fullSpots, fullSpot}