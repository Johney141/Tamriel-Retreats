const addPreview = (reviews) => {
    let updatedReviews = [];
    for(let review of reviews){
        let updatedReview = {
            id: review.id,
            userId: review.userId,
            spotId: review.spotId,
            review: review.review,
            stars: review.stars,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
            User: review.User
        }
        const Spot = {
            id: review.Spot.id,
            ownerId: review.Spot.ownerId,
            address: review.Spot.address,
            city: review.Spot.city,
            state: review.Spot.state,
            country: review.Spot.country,
            lat: review.Spot.lat,
            lng: review.Spot.lng,
            name: review.Spot.name,
            price: review.Spot.price,         
        }
        if(review.Spot.SpotImages.length > 0) {
            const previewImage = review.Spot.SpotImages[0];
            const previewUrl = previewImage.url;
            Spot.previewImage = previewUrl;
        } else {
            Spot.previewImage = null
        }
        updatedReview.Spot = Spot;
        updatedReview.ReviewImages = review.ReviewImages;
        updatedReviews.push(updatedReview);
    }
    return updatedReviews
};

module.exports = {addPreview}