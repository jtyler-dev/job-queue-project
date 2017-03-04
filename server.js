// Server.js

//base setup
var config = require('./config');
var express = require('express');
var app = express();

var mongoose = require('mongoose');
// set Promise provider to bluebird
//http://bluebirdjs.com/docs/api-reference.html
mongoose.Promise = require('bluebird');

var bodyParser  = require('body-parser');
var DbHelper = require('./app/db');

var jobQueue = require('./app/jobQueue');
// init our job queue
//jobQueue.initQueue(config.redis);

var jobController = require('./app/controllers/jobController');

//application vars
var db;

// get routes
var jobRoutes = require('./app/routes/jobRoutes');

// configure app to user body-parser to get data from POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// set the port that the app runs on
var port = process.env.PORT || config.port || 8080;

// setup routes
var router = express.Router();

// set up our endpoints for jobs
jobRoutes(router, jobController);

// use api as the base of our api url
app.use('/api', router);

// connect to the database and start the app
DbHelper.connect(config.mongoDbUrl, function(err, database) {
    if(err) {
        console.error(new Error("appliation not starting : not connected to db"));
        throw err;
    } else {
        console.log("Connected to database.");
        db = database;

        // jobQueue.initJobs();
        // initJobs.startProcessingQueue();
        // start the app if we are connected to the db
        console.log("Starting appliation");
        app.listen(port);
        console.log('Job parser has started on ' + port);

    }
});
