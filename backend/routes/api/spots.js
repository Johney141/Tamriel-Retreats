const express = require('express')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { fullSpots, fullSpot } = require('../../utils/spots')
const { Op, where } = require('sequelize')
const { fullBooking, ownerBookings, checkOverlap } = require('../../utils/bookings');



const router = express.Router();

router.use(restoreUser)

const validateQuerys = [
    check('page')
        .optional()
        .isInt({min: 1})
        .withMessage('Page must be greater than or equal to 1'),
    check('size')
        .optional()
        .isInt({min: 1})
        .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
        .optional()
        .isFloat({min: -90, max: 90})
        .withMessage('Maximum latitude is invalid'),
    check('minLat')
        .optional()
        .isFloat({min: -90, max: 90})
        .withMessage('Minimum latitude is invalid'),
    check('maxLng')
        .optional()
        .isFloat({min: -180, max: 180})
        .withMessage('Maximum longitude is invalid'),
    check('minLng')
        .optional()
        .isFloat({min: -180, max: 180})
        .withMessage('Minimum longitude is invalid'),
    check('minPrice')
        .optional()
        .isInt({min: 0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    check('minPrice')
        .optional()
        .isInt({min: 0})
        .withMessage('Minimum price must be greater than or equal to 0'),
    handleValidationErrors

]

router.get('/',validateQuerys , async (req, res, next) => {
    try {
        let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;
        let response = {};


        if(size) {
            size = parseInt(size);
            response.size = size;
        }
        if(page){
            page = parseInt(page);
            if(!size) {
                page = 1;
            
            } else {
                page = (page - 1) * size;
            }
        }
        const where = {};
        if(minLat) {
            minLat = parseFloat(minLat);
            where.lat = {
                [Op.gte]: minLat
            }
        }
        if(maxLat) {
            maxLat = parseFloat(maxLat);
            where.lat = {...where.lat,
                [Op.lte]: maxLat
            }
        }
        if(minLng) {
            minLng = parseFloat(minLng);
            where.lng = {
                [Op.gte]: minLng
            }
        }
        if(maxLng) {
            maxLng = parseFloat(maxLng);
            where.lng = {...where.lng,
                [Op.lte]: maxLng
            }
        }
        if(minPrice) {
            minPrice = parseInt(minPrice);
            where.price = {
                [Op.gte]: minPrice
            }
        }
        if(maxPrice) {
            maxPrice = parseInt(maxPrice);
            where.price = {
                [Op.lte]: maxPrice
            }
        }



        const spots = await Spot.findAll({
            limit: size,
            offset: page,
            where,
            include: [
                {
                    model: Review,
                    required: false
                },
                {
                    model: SpotImage,
                    where: {
                        isPreview: true
                    },
                    required: false
                }
            ]
        })

        if(!spots){
            next(new Error('No spots currently exist'))
        }
        
        let updatedSpots = await fullSpots(spots)
        response.Spots = updatedSpots;
        
           
        res.json({
            Spots: updatedSpots,
            page,
            size
        })
    } catch (error) {
        next(error)
    }
})

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const spots = await Spot.findAll({
            where: {
                ownerId: userId
            },
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    where: {
                        isPreview: true
                    }
                }
            ]
        })
        if(!spots) {
            next(new Error('Current User does not have any spots'))
        }
    
        const updatedSpots = await fullSpots(spots)
    
        res.json({
            Spots: updatedSpots
        })
    } catch (error) {
        next(error)
    }

})

router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);

        const spot = await Spot.findByPk(spotId, {
            include: [
                {
                    model: Review
                },
                {
                    model: SpotImage,
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'spotId']
                    }
                },
                {
                    model: User,
                    as: 'Owner',
                    attributes: ['id', 'firstName', 'lastName']
                }
            ]
        })

        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            next(noSpot)
        }

        const updatedSpot = fullSpot(spot);

        res.json(updatedSpot)

    } catch (error) {
        next(error)
    }
});

const validateSpot = [
    check('address')
        .exists({checkFalsy: true})
        .withMessage('Street address is required'),
    check('city')
        .exists({checkFalsy: true})
        .withMessage('City is required'),
    check('state')
        .exists({checkFalsy: true})
        .withMessage('State is required'),
    check('country')
        .exists({checkFalsy: true})
        .withMessage('Country is required'),
    check('lat')
        .exists({checkFalsy: true})
        .isFloat({min: -90, max: 90})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({checkFalsy: true})
        .isFloat({min: -180, max: 180})
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({checkFalsy: true})
        .withMessage('Name is required'),

    check('description')
        .exists({checkFalsy: true}).withMessage("Description is required")
        .isLength({min: 30}).withMessage("Description needs a minimum of 30 characters"),
    check('price')
        .exists({checkFalsy: true})
        .isInt({min: 1})
        .withMessage('Price per day is required'),
    handleValidationErrors
]

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    try {
        let { address, city, state, country, lat, lng, name, description, price } = req.body;
        lat = parseFloat(lat)
        lng = parseFloat(lng)
        price = parseInt(price)


        const ownerId = req.user.id;
        const newSpot = await Spot.create({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            ownerId
        })

        let responseSpot = {
            id: newSpot.id,
            ownerId: newSpot.ownerId,
            address: newSpot.address,
            city: newSpot.city,
            state: newSpot.state,
            country: newSpot.country,
            lat: newSpot.lat,
            lng: newSpot.lng,
            name: newSpot.name,
            description: newSpot.description,
            price: newSpot.price,
            createdAt: newSpot.createdAt,
            updatedAt: newSpot.updatedAt
        }
        console.log(responseSpot)
        return res.status(201).json(responseSpot);

    } catch (error) {
        next(error)
    }
})


router.get('/:spotId/reviews', async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const spot = await Spot.findByPk(spotId)
        
        if(!spot) {
            const noSpots = new Error("Spot couldn't be found")
            noSpots.status = 404;
            return next(noSpots);
        }
        const reviews = await Review.findAll({
            where: { spotId },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });
    
        if(!reviews) {
            const noSpots = new Error("Spot couldn't be found")
            noSpots.status = 404;
            return next(noSpots);
        }
        res.json({
            Reviews: reviews
        })
    } catch (error) {
        next(error);
    }
});
router.get('/:spotId/bookings', requireAuth, async(req, res, next) => {
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
            let updatedBookings = []
            for(let booking of bookings){
                let updatedBooking = {
                    spotId: booking.spotId,
                    startDate: booking.startDate.toISOString().slice(0, 10),
                    endDate: booking.endDate.toISOString().slice(0, 10),
                }
                updatedBookings.push(updatedBooking)
            }

            return res.json({
                Bookings: updatedBookings
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
const validateReview = [
    check('review')
        .exists({checkFalsy: true})
        .withMessage('Review text is required'),
    check('stars')
        .exists({checkFalsy: true})
        .isInt({min: 1, max: 5})
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id
        const spot = await Spot.findByPk(spotId);
        const reviewCheck = await Review.findOne({
            where: {
                userId,
                spotId,
            }
        })
        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404;
            return next(noSpot);
        }
        if(reviewCheck) {
            const existingReview = new Error("User already has a review for this spot");
            return next(existingReview);
        }
    
        const { review, stars } = req.body;
    
    
        const newReview = await Review.create({
            userId,
            spotId,
            review,
            stars
        });
    
        res.status(201).json(newReview);
    } catch (error) {
       next(error) 
    }
})

router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id;
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            return next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }

        const { url, isPreview } = req.body;
        const newSpotImage = await SpotImage.create({
            url,
            spotId,
            isPreview
        });

        return res.status(201).json({
            id: newSpotImage.id,
            url: newSpotImage.url,
            preview: newSpotImage.isPreview
        })
    } catch (error) {
        next(error);
    }
})
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
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

        if(spot.ownerId === userId) {
            const cannotOwn = new Error("Forbidden");
            cannotOwn.status = 403;
            return next(cannotOwn);
        }

        const currentBookings = await Booking.findAll({
            where: {
                spotId
            }
        });

        startDate = new Date(startDate);
        endDate = new Date(endDate);
        let currentDate = new Date();
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
        
        if(startDate <= currentDate) {
            const pastBooking = new Error('Cannot have booking in the past');
            pastBooking.status = 400;
            return next(pastBooking)
        }

        const newBooking = await Booking.create({
            spotId,
            userId,
            startDate,
            endDate
        })

        const response = {
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate.toISOString().slice(0, 10),
            endDate: newBooking.endDate.toISOString().slice(0, 10),
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt
        }
        
        return res.status(201).json(response)
    } catch (error) {
        next(error);
    }
})

router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.findByPk(spotId);


        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            return next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }
        

        await spot.update({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            ownerId: userId
        })

        return res.json(spot);

    } catch (error) {
        next(error);
    }
})

router.delete('/:spotId/images', requireAuth, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id;
        const spot = await Spot.findByPk(spotId);

        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            return next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }
        const spotImages = await SpotImage.findAll({
            where: {spotId}
        });
        if(!spotImages) {
            const noSpotImg = new Error("Spot Does not have images")
            noSpotImg.status = 404;
            return next(noSpotImg);
        }
        const deletedImages = [];
        for(let img of spotImages) {
            deletedImages.push(img.toJSON());
            await img.destroy();
        }

        res.status(200).json(deletedImages)

    } catch (error) {
        next(error)
    }
})

router.delete('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id;
        const spot = await Spot.findByPk(spotId)

        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            return next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }
        
        await spot.destroy();

        return res.json(spot)

    } catch (error) {
        next(error)
    }
})





module.exports = router