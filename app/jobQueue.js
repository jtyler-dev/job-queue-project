// app/jobQueue.js

// pull in kue to run our jobs
// https://github.com/Automattic/kue
var kue = require('kue');
var Job = require('./models/job');
var ObjectId = require('mongoose').Types.ObjectId;

// pull in lib for making http requests
// https://github.com/request/request
// https://github.com/request/request-promise
var rp = require('request-promise');

var jobQueue = function() {

    // out job queue object, provided by kue
    var queue;

    var initQueue = function(redisConfig) {
        var config = {};
        // setup queue with redis config if any
        if(redisConfig) {
            // TODO: add config type checking,
            // for now just toss the config in
            config = redisConfig;
        }

        this.queue = kue.createQueue(config);
    };

    var addJob = function (job) {
        var queueJob = this.queue.create('getData', {
            jobId: job.id
        }).save( function(err){
            if( !err ) console.log( queueJob.id );
        });

        // job has started processing
        queueJob.on('start', function() {
            // update status to processing
            var job = Job.findById(queueJob.data.jobId).then(function(j){
                //console.log("starting to process job id: " + j.id + " url: " + j.url);
                j.inProgress();
            });
        });

        // job has finished
        queueJob.on('complete', function() {
            // update status to complete
            var job = Job.findById(queueJob.data.jobId).then(function(j){
                //console.log("completed processing job id: " + j.id + " url: " + j.url);
                j.complete();
            });
        });

        // job has failed
        queueJob.on('failed', function() {
            // update status to complete
            var job = Job.findById(queueJob.data.jobId).then(function(j){
                //console.log("processing failed for job id: " + j.id + " url: " + j.url);
                j.error();
            });
        });

    };

    var processJob = function (jobId, done) {
        if(!ObjectId.isValid(jobId)) {
            return done(new Error('invalid to job ID'));
        } else {
            Job.findById(jobId).then(function(job){

                //console.log("processing job id: " + job.id + " url: " + job.url);
                var url = job.url;
                if(job.status === "pending" || job.status === "in process")
                {
                    // The resolveWithFullResponse options allows to pass the full response:
                    rp({ uri: url, resolveWithFullResponse: true })
                    .then(function(response) {
                        var statusCode = response && response.statusCode;
                        var body = response && response.body;

                        job.response = body;
                        job.statusCode = statusCode;
                        job.updatedAt = new Date();
                        job.save();
                        done();
                    }).catch(function(err) {
                        //console.log("error processing job id: " + job.id + " url: " + job.url);
                        job.error(err);
                        done();
                    });
                }
            });
        }
    };

    var startProcessingQueue = function(){
        this.queue.process('getData', function(job, done) {
            processJob(job.data.jobId, done);
        });
    };

    return {
        initQueue: initQueue,
        addJob: addJob,
        startProcessingQueue: startProcessingQueue
    };
};

module.exports = jobQueue;
