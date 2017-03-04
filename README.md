# job-queue-project
Job queue project. Code Challenge project

#Task
Create a job queue whose workers fetch data from a URL and store the results in a database.  The job queue should expose a REST API with, at minimum, a few end points:
1) An end point for adding a job to the queue.
2) An end point for checking on the status of a job (and retrieving the results, if available)

#Example User Story
A user submits http://www.google.com to your endpoint. If successful, the user gets back an appropriate response which contains a Job ID. The job queue fetches the data at the URL you provided and stores the result (which, in this case, should be HTML). The user is then able to request the status of the job using the Job ID that was provided. If the job is complete, the user receives a response containing the stored data (in this case, the HTML for google.com). if the job is not yet complete, the user receives a message telling them that the job is not complete yet. If for some reason, the job cannot be completed, the user receives an appropriate response for this as well.


#Requirements
- Nodejs
- Redis
- MongoDB

#Setup
- npm install
- Change config.json to be the way you want it
- start up mongoDB (EX: mongod --dbpath ./data/db/)
- start up redis (EX: redis-server)
- start the node application (node server.js)

#Config Options
- 'mongoDbUrl' - Where the app tries to connect to the db. defaults to "mongodb://localhost/jobsQueue"
- 'port' - change what port the app is run on: Default is 8080
- 'redisConfig' - Object that contains redis config. example config would look like this
'redisConfig :{
    redis: {
        port: 1234,
        host: '10.0.50.20',
        auth: 'password',
        db: 3, // if provided select a non-default redis db
        options: {
          // see https://github.com/mranney/node_redis#rediscreateclient
        }
      }
  }'

#Explanation


run app in debig mode
node --inspect --debug-brk index.js
