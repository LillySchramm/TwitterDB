const express = require('express');
const router = express.Router();

const mongodb = require('../tools/mongoDB')

router.get('/', async (req, res, next) => {    
    
    mongodb.getStats().then((resp) => {
        res.status(200).json(resp)
    })

});


module.exports = router;