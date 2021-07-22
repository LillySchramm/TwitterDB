const mon = require('./tools/mongoDB')
const http = require('http');

const fs = require('fs')

const express = require('express');
const port = 55536;

const app = express();
const getRoute = require('./routes/get')
const topRoute = require('./routes/tops')
const statsRoute = require('./routes/stats')

const cors = require('cors')

app.use(cors({ origin: true }));
app.use('/get', getRoute);
app.use('/top', topRoute);
app.use('/stats', statsRoute);

app.get('*', function(req, res){
    res.status(404).json({"error": "path not fount"});
});  

const server = http.createServer(app)

server.listen(port);


