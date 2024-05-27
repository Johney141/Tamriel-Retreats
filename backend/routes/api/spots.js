const express = require('express')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { fullSpots, fullSpot } = require('../../utils/spots')



const router = express.Router();

router.use(restoreUser)

router.get('/', async (req, res, next) => {
    try {
        const spots = await Spot.findAll({
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

router.post('/', requireAuth, async (req, res, next) => {
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

        res.json(newSpot);

    } catch (error) {
        next(error)
    }
})


router.put('/:spotId', requireAuth, async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
        const userId = req.user.id;
        const { address, city, state, country, lat, lng, name, description, price } = req.body;
        const spot = await Spot.findByPk(spotId);


        if(!spot) {
            const noSpot = new Error("Spot couldn't be found");
            noSpot.status = 404
            next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            next(notAuth)
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

        res.json(spot);

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
            next(noSpot)
        }

        if(spot.ownerId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            next(notAuth)
        }
        
        await spot.destroy();

        res.json({
            message: "Successfully deleted"
          })

    } catch (error) {
        next(error)
    }
})





module.exports = router