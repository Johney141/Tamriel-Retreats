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



module.exports = router;