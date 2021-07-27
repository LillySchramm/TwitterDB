const secret = require('./secret')
const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(secret.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()

const SITEMAP_INDEX_TEMPLATE = '<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">[sitemaps]</sitemapindex>'
const SITEMAP_INDEX_ITEM_TEMPLATE = '<sitemap><loc>[url]</loc><lastmod>[lastmod]</lastmod></sitemap>'

async function getData(name){    
    return new Promise(async (resolve, reject) => {

        var ret;   

        db = "TwitterDB"
        col = ""

        if(name.startsWith("@")){
            col = "tags"
        }else{
            col = "hashtags"
        }

        const collection = client.db(db).collection(col);

        const query = { name: name };    
        const options = {
            projection: { _id: 0, name: 1, timeline: 1 },
        };

        ret = await collection.findOne(query, options)
        
        // Error handling
        if(ret == undefined){ 
            resolve ({
                name:name,
                timeline:[]
            })
        }else{
            // Remove WIP data
            if(ret.timeline[0].timestamp == getCurrentDate()) ret.timeline.shift()

            resolve(ret)      
        }       
    })    
}

async function getTop(timestamp){
    return new Promise(async (resolve, reject) => {
        var ret;   

        const collection = client.db("TwitterDB").collection("top");

        const query = { timestamp: parseInt(timestamp) };    
        const options = {
            projection: { _id: 0},
        };

        ret = await collection.findOne(query, options)

        resolve(ret)                  
    })    
}

async function getNewestTop(){
    return new Promise(async (resolve, reject) => {
        var ret;   

        const collection = client.db("TwitterDB").collection("top");

        const query = {};    
        const options = {
            projection: { _id: 0 },
            sort: {_id : -1},
            limit: 1
        };

        ret = await collection.findOne(query, options)

        resolve(ret)                  
    })    
}

async function getStats(timeline){
    return new Promise(async (resolve, reject) => {
        var ret;   

        const collection = client.db("TwitterDB").collection("totals");

        const query = {  };    
        
        let limit = timeline ? 999999 : 1

        const options = {
            projection: { _id: 0, id: 0 },
            sort: {_id : -1},
            limit: limit
        };

        ret = 0

        if(!timeline) ret = await collection.findOne(query, options)         
        else ret = await collection.find(query, options).toArray()

        resolve(ret)                  
    })    
}

async function getRecommendations(search){
    return new Promise(async (resolve, reject) => {

        const collectionTags = client.db("TwitterDB").collection("tags");
        const collectionHashtags = client.db("TwitterDB").collection("hashtags");

        var options = {
            projection: { _id: 0, timeline: 0 },
            sort: {"timeline.count": -1},
            limit: 5
        };

        var query = { name : new RegExp("^" + search)};
        if(search.startsWith("@")){          
            options.limit = 10
            resolve(await collectionTags.find(query, options).toArray())
        }else if(search.startsWith("#")){
            options.limit = 10
            resolve(await collectionHashtags.find(query, options).toArray())
        }else{
            query = { name : new RegExp("^@" + search)};    
            var ret = await collectionTags.find(query, options).toArray()    
            query = { name : new RegExp("^#" + search)};        
    
            ret = ret.concat(await collectionHashtags.find(query, options).toArray()).sort()
    
            resolve(ret)         
        }         
    })    
}

async function getSiteMap(name){
    return new Promise(async (resolve, reject) => {
        var ret;   

        const collection = client.db("TwitterDB").collection("sitemaps");
        const query = { name:name };   
        const options = {
            projection: { _id: 0, data: 1},            
        };

        ret = await collection.findOne(query, options)

        resolve(ret["data"])
    })
}

async function getSiteMapIndex(){
    return new Promise(async (resolve, reject) => {
        var ret;   

        const collection = client.db("TwitterDB").collection("sitemaps");
        const query = {  };   
        const options = {
            projection: { _id: 0, name: 1 },
            sort: {}
        };

        ret = await collection.find(query, options).toArray()

        let temp = ""
        const now = new Date()

        for(let x of ret){
            temp += SITEMAP_INDEX_ITEM_TEMPLATE.replace("[url]", "https://api.twitterdb.com/sitemap/" + secret.SITEMAP_URL + "/" + x["name"] + ".xml")
            .replace('[lastmod]', now.toISOString())
        }

        resolve(SITEMAP_INDEX_TEMPLATE.replace('[sitemaps]', temp))                  
    })    
}

function getCurrentDate() {
    let date = new Date()

    date.setMilliseconds(0)
    date.setSeconds(0)
    date.setMinutes(0)

    return Math.floor(date.getTime()/1000)
}

module.exports = {getData, getTop, getNewestTop, getStats, getRecommendations, getSiteMapIndex, getSiteMap}