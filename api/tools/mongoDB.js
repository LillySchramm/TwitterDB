const secret = require('./secret')
const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(secret.MongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect()

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

        resolve(ret)      
            
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

module.exports = {getData, getTop, getNewestTop, getStats}