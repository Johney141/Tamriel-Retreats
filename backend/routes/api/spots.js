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
        let updatedSpots = []
        for(let spot of spots){
            const spotId = spot.id;
            const reviews = await Review.findAll({
                where: {spotId}
            });
            let reviewCount = reviews.length;
            let starSum = reviews.reduce((sum, review) => sum + review.stars, 0);

            let updatedSpot = spot.toJSON();

            updatedSpot.avgRating = starSum / reviewCount;
            


            const previewImage = await SpotImage.findOne({
                where: {
                    spotId,
                    isPreview: true
                }
            })
            
            updatedSpot.previewImage = previewImage.url;
            updatedSpots.push(updatedSpot)
        }
       
        res.json(updatedSpots)

    } catch (error) {
        next(error)
    }
})






module.exports = router