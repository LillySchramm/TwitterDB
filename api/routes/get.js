const express = require('express');
const router = express.Router();

const mongodb = require('../tools/mongoDB')

router.get('/:type/:name', async (req, res, next) => {    
    const type = req.params.type;
    const name = req.params.name.toLowerCase()

    var prefix = ""

    if(type === "tag"){
        prefix = "@"
    }else if(type === "hashtag"){
        prefix = "#"
    }else{
        res.status(400).json({
            error:"Bad type. Only 'tag' or 'hashtag' allowed"
        })

        return
    }

    mongodb.getData(prefix + name).then((resp) => {
        res.status(200).json(resp)
    })

});


module.exports = router;