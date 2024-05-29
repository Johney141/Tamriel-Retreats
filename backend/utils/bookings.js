const fullBooking = (bookings) => {
    let updatedBookings = [];
    for(let booking of bookings) {
        let updatedBooking = {
            id: booking.id,
            spotId: booking.spotId
        }

        const Spot = {
            id: booking.Spot.id,
            ownerId: booking.Spot.ownerId,
            address: booking.Spot.address,
            city: booking.Spot.city,
            state: booking.Spot.state,
            country: booking.Spot.country,
            lat: booking.Spot.lat,
            lng: booking.Spot.lng,
            name: booking.Spot.name,
            price: booking.Spot.price,   
        }
        if(booking.Spot.SpotImages.length > 0) {
            const previewUrl = review.Spot.SpotImages[0].url;
            Spot.previewImage = previewUrl;
        } else {
            Spot.previewImage = null;
        }
        updatedBooking = {...updatedBooking,
            Spot,
            userId: booking.userId,
            startDate: booking.startDate,
            endDate: booking.endDate,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        updatedBookings.push(updatedBooking)
    }
}


module.exports = { fullBooking }