const express = require('express');
const router = express.Router();
const secret = require('../tools/secret')

const mongodb = require('../tools/mongoDB')

router.get('/' + secret.SITEMAP_URL + '/d/i.xml', async (req, res, next) => {    
    
    mongodb.getSiteMapIndex().then((resp) => {
        res.status(200)
        res.type('application/xml');
        res.send(resp);
    })

});

router.get('/' + secret.SITEMAP_URL + '/:name', async (req, res, next) => {    
    const name = req.params.name.replace(".xml", "");

    mongodb.getSiteMap(name).then((resp) => {
        res.status(200)
        res.type('application/xml');
        res.send(resp);
    })
    

});



module.exports = router;