const express = require('express');
const router = express.Router();

const mongodb = require('../tools/mongoDB')

router.get('/:timestamp', async (req, res, next) => {    
    const timestamp = req.params.timestamp;
    
    mongodb.getTop(timestamp).then((resp) => {
        res.status(200).json(resp)
    })

});

router.get('/', async (req, res, next) => {    
    mongodb.getNewestTop().then((data) => {
        res.status(200).json({
            data
        })
    })
});


module.exports = router;