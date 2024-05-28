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

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = parseInt(req.params.reviewId);
        const review = await Review.findByPk(reviewId, {
            include: [
                {
                    model: ReviewImage,
                }
            ]
        })
        if(!review) {
            const noReview = new Error("Review couldn't be found");
            noReview.status = 404;
            return next(noReview);
        }
        if(review.ReviewImages.length > 10 ){
            const resourceLimit = new Error('Maximum number of images for this resource was reached')
            resourceLimit.status = 403;
            return next(resourceLimit);
        }

        if(review.userId !== userId){
            const notAuth = new Error("Forbidden");
            notAuth.status = 403;
            return next(notAuth);
        }
        const { url } = req.body
        const newReviewImage = await ReviewImage.create({
            url,
            reviewId
        });

        res.json({
            id: newReviewImage.id,
            url: newReviewImage.url
        })

    } catch (error) {
        next(error);
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
router.post('/:spotId', requireAuth, validateReview, async (req, res, next) => {
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

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
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


router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    try {
        const userId = req.user.id;
        const reviewId = parseInt(req.params.reviewId);
        const review = await Review.findByPk(reviewId);

        if(!review){
            const noReview = new Error("Review couldn't be found");
            noReview.status = 404;
            return next(noReview);
        }
        
        if(updateReview.userId !== userId){
            const notAuth = new Error("Forbidden");
            notAuth.status = 403;
            return next(notAuth);
          };

        await review.destroy();

        res.json({
            message: "Successfully deleted"
        })

    } catch (error) {
        next(error);
    }
})


module.exports = router;