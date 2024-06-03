const fullBooking = (bookings) => {
    let updatedBookings = [];
    for(let booking of bookings) {
        let updatedBooking = {
            id: booking.id,
            spotId: booking.spotId
        }

        const Spot = {
            id: booking.Spots.id,
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
            const previewUrl = booking.Spot.SpotImages[0].url;
            Spot.previewImage = previewUrl;
        } else {
            Spot.previewImage = null;
        }
        updatedBooking = {...updatedBooking,
            Spot,
            userId: booking.userId,
            startDate: booking.startDate.toISOString().slice(0, 10),
            endDate: booking.endDate.toISOString().slice(0, 10),
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        updatedBookings.push(updatedBooking)
    }
    return updatedBookings;
}




const ownerBookings = (bookings) => {
    let updatedBookings = [];
    for(let booking of bookings){
        let updatedBooking = {
            User: booking.User,
            id: booking.id,
            spotId: booking.spotId,
            userId: booking.userId,
            startDate: booking.startDate.toISOString().slice(0, 10),
            endDate: booking.endDate.toISOString().slice(0, 10),
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt
        }
        updatedBookings.push(updatedBooking)
    }
    return updatedBookings
}


const checkOverlap = (startDate, endDate, bookings) => {
    const overlap = {
        hasOverlap: false,
        startOverlap: false,
        endOverlap: false
    }
    for(let booking of bookings) {
        const bookingStartDate = new Date(booking.startDate);
        const bookingEndDate = new Date(booking.endDate);
        // If the start date is in the booking
        if(startDate >= bookingStartDate && startDate <= bookingEndDate) {
            overlap.hasOverlap = true;
            overlap.startOverlap = true   
        } 
        // If the end date is in the booking
        if(endDate >= bookingStartDate && endDate <= bookingEndDate) {
            overlap.hasOverlap = true;
            overlap.endOverlap = true
        }
        // If the booking is within the start and end date ranges
        if(startDate <= bookingStartDate && endDate >= bookingEndDate) {
            overlap.hasOverlap = true;
            overlap.startOverlap = true;
            overlap.endOverlap = true;
        }
    }
    return overlap
}


module.exports = { fullBooking, ownerBookings, checkOverlap }