const express = require('express')
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const router = express.Router();



router.get('/', async (req, res, next) => {
    try {
        
        const spots = await Spot.findAll()

        if(!spots){
            next(new Error('No spots currently exist'))
        }

        res.json(spots)

    } catch (error) {
        next(error)
    }
})






module.exports = router