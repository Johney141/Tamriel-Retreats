const express = require('express')
const bcrypt = require('bcryptjs');

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, SpotImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { addPreview } = require('../../utils/reviews');

const router = express.Router();

router.use(restoreUser)

router.get('/current', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviews = await Review.findAll({
            where: {
                userId
            },
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName']
                },
                {
                    model: Spot,
                    include: {
                        model: SpotImage,
                        where: {
                            isPreview: true
                        }
                    }
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url']
                }
            ]
        });
        if(!reviews) {
            return next(new Error('Current User does not have any reviews'))
        }

        const updatedReview = addPreview(reviews)

        res.json({
            Reviews: updatedReview
        })


    } catch (error) {
        next(error);
    }
})

router.get('/:spotId', async (req, res, next) => {
    try {
        const spotId = parseInt(req.params.spotId);
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


router.post('/:spotId', requireAuth, async (req, res, next) => {
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
    
        res.json(newReview);
    } catch (error) {
       next(error) 
    }
})

router.put('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = parseInt(req.params.reviewId);
        const updateReview = await Review.findByPk(reviewId);

        if(!updateReview) {
            const noReview = new Error("Review couldn't be found");
            noReview.status = 404;
            return next(noReview);
        };
        if(updateReview.userId !== userId){
          const notAuth = new Error("Forbidden");
          notAuth.status = 403;
          return next(notAuth);
        };

        const { review, stars } = req.body;
        
        await updateReview.update({
            userId,
            spotId: updateReview.spotId,
            review,
            stars
        })

        res.json(updateReview);

    } catch (error) {
        next(error);
    }
})



module.exports = router;