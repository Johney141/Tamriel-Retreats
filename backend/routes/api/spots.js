const express = require('express')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { fullSpots, fullSpot } = require('../../utils/spots')
const { Op, where } = require('sequelize')



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



        if(size) {
            size = parseInt(size);
        }
        if(page){
            page = parseInt(page);
            page = (page - 1) * size;
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
           
        res.json({
            Spots: updatedSpots
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
        .isString()
        .isLength({max: 50})
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({checkFalsy: true})
        .withMessage("Description is required"),
    check('price')
        .exists({checkFalsy: true})
        .isInt({min: 1})
        .withMessage('Price per day is required'),
    handleValidationErrors
]

router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    try {
        const { address, city, state, country, lat, lng, name, description, price } = req.body;

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

        let responseSpot = {...newSpot.dataValues};
        delete responseSpot.ownerId

        return res.json(responseSpot).status(201);

    } catch (error) {
        next(error)
    }
})

router.delete('/images/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imgId = parseInt(req.params.imageId);
        const userId = req.user.id;
        const spotImg = await SpotImage.findByPk(imgId);
        const spot = await Spot.findByPk(spotImg.spotId);

        if(!spotImg) {
            const noSpot = new Error("Spot Image couldn't be found");
            noSpot.status = 404
            return next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }

        await spotImg.destroy();

        return res.json({
            message: "Successfully deleted"
          })

    } catch (error) {
        next(error);
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

        const { url, preview } = req.body;
        const newSpotImage = await SpotImage.create({
            url,
            spotId,
            isPreview: preview
        });

        return res.json({
            id: newSpotImage.id,
            url: newSpotImage.url,
            preview: newSpotImage.isPreview
        })
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

        return res.json({
            message: "Successfully deleted"
          })

    } catch (error) {
        next(error)
    }
})





module.exports = router