const router = require('express').Router();
const { restoreUser } = require('../../utils/auth.js');
const { setTokenCookie } = require('../../utils/auth.js');
const { User } = require('../../db/models');
const { requireAuth } = require('../../utils/auth.js');


router.use(restoreUser);


module.exports = router;