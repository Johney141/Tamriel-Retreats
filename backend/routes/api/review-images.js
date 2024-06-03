const express = require('express')

const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, Review, ReviewImage, User, SpotImage} = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();

router.use(restoreUser)


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    try {
        const imgId = parseInt(req.params.imageId);
        const userId = req.user.id;
        const reviewImg = await ReviewImage.findByPk(imgId);
        

        if(!reviewImg) {
            const noReview = new Error("Review Image couldn't be found");
            noReview.status = 404
            return next(noReview)
        }
        
        const review = await Review.findByPk(reviewImg.reviewId);
        if(review.userId !== userId) {
            const notAuth = new Error("Forbidden")
            notAuth.status = 403
            return next(notAuth)
        }

        await reviewImg.destroy();

        return res.json({
            message: "Successfully deleted"
          })

    } catch (error) {
        next(error);
    }
})

module.exports = router