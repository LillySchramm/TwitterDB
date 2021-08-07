const express = require('express');
const router = express.Router();

const mongodb = require('../tools/mongoDB')

router.get('/:type/:search', async (req, res, next) => {    

    let search = req.params.search;
    let type = req.params.type;

    if(search.length <= 30){
        search = search.toLowerCase();
        if(type == "tag" && !search.startsWith("@")) search = "@" + search
        else if (type == "hashtag") search = "#" + search
        
        mongodb.getRecommendations(search).then((resp) => {
            res.status(200).json(resp)
        })
    }else{
        res.status(414).json({
            error:"The /search endpoint only accepts keywords up to 30 characters."
        })
    }
});


module.exports = router;