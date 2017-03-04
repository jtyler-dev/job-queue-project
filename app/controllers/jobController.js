// app/handlers/jobController.js

var ObjectId = require('mongoose').Types.ObjectId;
var Job = require('../models/job');

var JobController = function (jobQueue) {

    // handler for GET: /jobs/:id
    var getJob = function (req, res) {
        // get job id from the resquest object
        var jobId = req.params.id;
        if(ObjectId.isValid(jobId)) {
            Job.findById(jobId)
            .then(function(job) {
                res.json(job);
                res.status(200);
            }).error(function(err) {
                // handle error case
                res.json({
                    message: "Error finding job with job id: " + jobId,
                    error: err
                });
                res.status(400);
            });
        } else {
            // if the object id is invalid return empty object
            res.json({});
            res.status(200);
        }
    };

    // handler for GET : /jobs
    var getAllJobs = function (req, res) {
        Job.find().then(function(jobs) {
            res.json(jobs);
            res.status(200);
        }).error(function(err) {
            // handle error case
            res.json({
                message: "Error getting all jobs",
                error: err
            });
            res.status(400);
        });
    };

    // handler for POST: /jobs
    var createJob = function (req, res) {
        var jobUrl = req.body.url;
        var jobId, createdAt;

        if(jobUrl) {
            createdAt = new Date();

            var job = new Job({
                id: jobId,
                url: jobUrl,
                status: "pending",
                createdAt: createdAt
            });

            job.save()
            .then(function(job){
                jobQueue.addJob(job);
                res.json(job.limitedJSON());
                res.status(201);
            }).error(function(err) {
                // handle error case
                res.json({
                    message: "Error saving job",
                    error: err
                });
                res.status(400);
            });
        }
    };

    return {
        getJob : getJob,
        getAllJobs: getAllJobs,
        createJob: createJob
    };
};

module.exports = JobController;
