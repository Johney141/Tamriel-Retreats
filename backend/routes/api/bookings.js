const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, User, Booking, SpotImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { fullBooking, ownerBookings, checkOverlap } = require('../../utils/bookings');


const router = express.Router();

router.use(restoreUser)

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookings = await Booking.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: Spot,
                    include: [
                        {
                            model: SpotImage,
                            where: {isPreview: true}
                        }
                    ]
                }
            ]
        })


        if(!bookings) {
            const noBookings = new Error('Current User does not have any bookings');
            noBookings.status = 404
            return next(noBookings);
        };

        const updatedBooking = fullBooking(bookings);
        console.log(updatedBooking)

        res.json({
            Bookings: updatedBooking
        })

    } catch (error) {
        next(error)
    }
})


// const validateBooking = [
//     check('date')
// ]


router.put('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = parseInt(req.params.bookingId);
        let { startDate, endDate } = req.body;
        const booking = await Booking.findByPk(bookingId);
        
        if(!booking){
            const noBooking = new Error("Booking couldn't be found");
            noBooking.status = 404
            return next(noBooking);
        }

        if(booking.userId !== userId) {
            const notAuth = new Error('Forbidden');
            notAuth.status = 403;
            return next(notAuth);
        }
        const currentDate = new Date();
        if(booking.endDate <= currentDate){
            const pastBooking = new Error("Past bookings can't be modified");
            pastBooking.status = 400;
            return next(pastBooking)
        }
        const spotId = booking.spotId;

        const currentBookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        const overlaps = checkOverlap(startDate, endDate, currentBookings)

        if(overlaps.hasOverlap) {
            const overlapError = new Error('Sorry, this spot is already booked for the specified dates');
            overlapError.status = 403;
            overlapError.errors = {};

            if(overlaps.startOverlap) {
                overlapError.errors.startDate = "Start date conflicts with an existing booking";       
            }

            if(overlaps.endOverlap) {
                overlapError.errors.endDate = "End date conflicts with an existing booking";
            }

            return next(overlapError);
        }

        await booking.update({
            startDate,
            endDate
        })

        res.json(booking)

    } catch (error) {
        next(error)
    }
})

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = parseInt(req.params.bookingId);
        const booking = await Booking.findByPk(bookingId);
        

        if(!booking) {
            const noBooking = new Error("Booking couldn't be found")
            noBooking.status = 404;
            return next(noBooking);
        }
        const spot = await Spot.findByPk(booking.spotId)
        if(booking.userId !== userId  && spot.ownerId !== userId){
            const notAuth = new Error('Forbidden');
            notAuth.status = 403;
            return next(notAuth);
        }
        const currentDate = new Date();
        if(booking.startDate <= currentDate){
            const bookingStarted = new Error("Bookings that have been started can't be deleted");
            bookingStarted.status = 403;
            return next(bookingStarted)
        }

        await booking.destroy();

        return res.json({
            message: "Successfully deleted"
          })


    } catch (error) {
        next(error);
    }
})



module.exports = router