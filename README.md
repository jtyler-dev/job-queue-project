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
```
redisConfig :{
    redis: {
        port: 1234,
        host: '10.0.50.20',
        auth: 'password',
        db: 3, // if provided select a non-default redis db
        options: {
          // see https://github.com/mranney/node_redis#rediscreateclient
        }
      }
  }
  ```

#Using the API
##GET /api/jobs
returns all jobs currently in the app. Returned data will be in this format.
'''
[
    {
        "updatedAt": "2017-03-03T21:52:15.961Z",
        "responseCode": "",
        "response": null,
        "url": "progressTest.com",
        "status": "pending",
        "createdAt": "2017-03-03T21:52:15.961Z",
        "id": "58b9e58feec5d62972ef51f2"
    }
]
'''
##GET /api/jobs/:id
Returns the job for the given job id. returns an empty object if a job could not be found.
'''
    {
        "updatedAt": "2017-03-03T21:52:15.961Z",
        "responseCode": "",
        "response": null,
        "url": "progressTest.com",
        "status": "pending",
        "createdAt": "2017-03-03T21:52:15.961Z",
        "id": "58b9e58feec5d62972ef51f2"
    }
'''
##POST /api/jobs
Posts to the jobs api will create a new job to run and add it to the queue.
To create and add a new job to the queue, use this format
'''
Content-Type: application/json
{"url": "http://www.google.com"}
'''
The post will return a simplified version of the job data if was successful
'''
    {
      "id": "58ba8ca025ff203b8c27c532",
      "status": "pending",
      "url": "http://www.google.com"
    }
'''

#Explanation
##Stack
When I saw that the goal of this application was to just generate a simple REST Api, I jumped on the chance to
build out a nodejs app. I have used node in the past, so Iam familiar with it can and cannot do. I also wanted to
practice using a nosql db and mongo db was one that I had started learning earlier in the year so I took this chance
to use it. Including redis in this stack came later when I was implementing the job queue. Redis is dependency for
kue so I tossed it as well.
##Libraries
######bluebird.js
bluebird.js is a promise Library. Nodejs deprecated their own promise Library so I had
to pull one in. My research into promise libs for nodejs I came across this one, and
it seemed to be the most popular option.  
######kue.js
Kue.js is priority job queue that is backed by redis. This lib does alot of the heavy lifting for me
when processing the job queue. It has everything I was looking for in a queue and was relatively easy to
implement in the project.
######Request and Request-Promise
Request is a simple http request lib, and request-promise is just a wrapper that goes around
request that allows you to use promises. I need this to scrape the data from the provided urls
in the app and this one was simple to setup and easy to use.

#Notes
run app in debug mode
'node --inspect --debug-brk index.js'
