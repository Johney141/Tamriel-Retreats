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

module.exports = router