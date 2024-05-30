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
        console.log(bookings)

        if(!bookings) {
            const noBookings = new Error('Current User does not have any bookings');
            noBookings.status = 404
            return next(noBookings);
        };

        const updatedBooking = fullBooking(bookings)
        console.log(updatedBooking)

        res.json({
            Bookings: updatedBooking
        })

    } catch (error) {
        next(error)
    }
})


router.get('/:spotId', requireAuth, async(req, res, next) => {
    try {
        const userId = req.user.id;
        const spotId = parseInt(req.params.spotId);
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404;
            return next(noSpot);
        }
        // If user is not the owner
        if(spot.ownerId !== userId) {
            const bookings = await Booking.findAll({
                where: {
                    spotId
                },
                attributes: ['spotId', 'startDate', 'endDate']
            })

            return res.json({
                Bookings: bookings
            })
        // If user is the owner
        } else {
            const bookings = await Booking.findAll({
                where: {
                    spotId
                },
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName']
                    }
                ]
            })
            const updatedBookings = ownerBookings(bookings);

            return res.json({
                Bookings: updatedBookings
            })

        }

    } catch (error) {
        next(error)
    }
})

const validateBooking = [
    check('date')
]
router.post('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spotId = parseInt(req.params.spotId);
        let { startDate, endDate } = req.body;
        const spot = await Spot.findByPk(spotId);
        if(!spot){
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            return next(noSpot);
        }

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

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        })

        
        return res.json(newBooking)
    } catch (error) {
        next(error);
    }
})

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const bookingId = parseInt(req.params.bookingId);
        let { startDate, endDate } = req.body;
        const booking = await Booking.findByPk(bookingId);
        
        if(!booking){
            const noBooking = new Error("Booking couldn't be found");
            noSpot.status = 404
            return next(noSpot);
        }

        if(booking.userId !== userId) {
            const notAuth = new Error('Forbidden');
            notAuth.status = 403;
            return next(notAuth);
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
        if(booking.userId !== userId){
            const notAuth = new Error('Forbidden');
            notAuth.status = 403;
            return next(notAuth);
        }
        const currentDate = new Date();
        if(booking.startDate >= currentDate){
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