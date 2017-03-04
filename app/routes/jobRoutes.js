// app/routes/job-routes.js
//REST endpoints for the job object
//var jobController = require('../controllers/jobController');

var jobRoutes = function (router, jobController) {
    router.get('/jobs/:id', jobController.getJob);
    router.get('/jobs', jobController.getAllJobs);
    router.post('/jobs', jobController.createJob);
};

module.exports = jobRoutes;
