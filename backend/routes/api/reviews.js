const express = require('express')

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
                    attributes: ['id', 'firstName', 'lastName'],
                    required: false
                },
                {
                    model: Spot,
                    include: {
                        model: SpotImage,
                        where: {
                            isPreview: true
                        },
                        required: false
                    },
                    required: false
                },
                {
                    model: ReviewImage,
                    attributes: ['id', 'url'],
                    required: false
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

        res.status(201).json({
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
        
        if(review.userId !== userId){
            const notAuth = new Error("Forbidden");
            notAuth.status = 403;
            return next(notAuth);
          };

        await review.destroy();

        res.json(review)

    } catch (error) {
        next(error);
    }
})


module.exports = router;