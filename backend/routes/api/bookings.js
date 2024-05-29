const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, User, Booking} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { fullBooking } = require('../../utils/bookings');


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

        const updatedBooking = fullBooking(bookings)

        res.json({
            Bookings: updatedBooking
        })

    } catch (error) {
        next(error);
    }
})


module.exports = router