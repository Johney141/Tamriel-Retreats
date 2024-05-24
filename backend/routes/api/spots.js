const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');



const router = express.Router();



router.get('/', async (req, res, next) => {
    try {
        
        const spots = await Spot.findAll()

        if(!spots){
            next(new Error('No spots currently exist'))
        }
        let avgRatings = []
        for(let spot of spots){
            const spotId = spot.id;
            const reviews = await Review.findAll({
                where: {spotId}
            });
            let reviewCount = reviews.length;
            let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);
            avgRatings.push(starSum / reviewCount)
            // spot.avgRating = starSum / reviewCount;


            const previewImage = await SpotImage.findOne({
                where: {
                    spotId,
                    isPreview: true
                }
            })
            console.log(spot)
            spot.previewImage = previewImage.url;
        }
        for(let spot of spots) {
            // spot.avgRating = 
        }
        res.json(spots)

    } catch (error) {
        next(error)
    }
})






module.exports = router