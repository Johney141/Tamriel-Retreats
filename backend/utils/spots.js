const fullSpots = async (spots) => {
    let updatedSpots = []
    for(let spot of spots){
        let updatedSpot = {
            id: spot.id,
            ownerId: spot.ownerId,
            address: spot.address,
            city: spot.city,
            state: spot.state,
            country: spot.country,
            lat: spot.lat,
            lng: spot.lng,
            name: spot.name,
            description: spot.description,
            price: spot.price,
            createdAt: spot.createdAt,
            updatedAt: spot.updatedAt,
        };
        
        if(spot.Reviews.length > 0){
            // Calculate avgRating
            const reviews = spot.Reviews
            let reviewCount = reviews.length;
            let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);

            updatedSpot.avgRating = (starSum / reviewCount).toFixed(1);
        } else {
            updatedSpot.avgRating = null;
        }
        if(spot.SpotImages.length > 0){   
            // Add Preview Image
            const previewImage = spot.SpotImages[0];

            updatedSpot.previewImage = previewImage.url;

            
        } else {
            updatedSpot.previewImage = null;
        }
        updatedSpots.push(updatedSpot)
    }
    return updatedSpots
}







const fullSpot = (spot) => {
    let updatedSpot = {
        id: spot.id,
        ownerId: spot.ownerId,
        address: spot.address,
        city: spot.city,
        state: spot.state,
        country: spot.country,
        lat: spot.lat,
        lng: spot.lng,
        name: spot.name,
        description: spot.description,
        price: spot.price,
        createdAt: spot.createdAt,
        updatedAt: spot.updatedAt,
    };
    if(spot.Reviews.length > 0){
        const reviews = spot.Reviews;
        const numReviews = reviews.length;
        let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);
        const avgRating = (starSum / numReviews).toFixed(1);


        updatedSpot.numReviews = numReviews;
        updatedSpot.avgStarRating = avgRating;
    } else {
        updatedSpot.numReviews = null;
        updatedSpot.avgStarRating = null;
    }

    if(spot.SpotImages.length > 0) {
        updatedSpot.SpotImages = spot.SpotImages;
    } else {
        updatedSpot.SpotImages = null;
    }
    updatedSpot.Owner = spot.Owner;



    return updatedSpot
}


module.exports = { fullSpots, fullSpot}