// app/models/job.js
// model for repersenting a reqested job

var mongoose = require('mongoose');
var schema = mongoose.schema;

var JobSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'complete', 'error', 'in process']
    },
    response: String,
    statusCode: String,
    createdAt: {
        type: Date,
        required: true},
    updatedAt: Date
}, {
    // make the json more readable, remove unnecessary fields
    // see: https://alexanderzeitler.com/articles/mongoose-tojson-toobject-transform-with-subdocuments/
    toJSON: {
        transform: function (doc, ret) {
            // leveage mongoDB providing an id
            ret.id = ret._id;
            // remove non-needed fields
            delete ret._id;
            delete ret.__v;
        }
    }
});

// helper methods

// fill out all of our missing fields so we have a
// more complete object to work with
JobSchema.pre('save', function(next){
    if(!this.response) {
        this.response = null;
    }

    if(!this.statusCode) {
        this.statusCode = '';
    }

    if(!this.updatedAt) {
        this.updatedAt = this.createdAt;
    }

    next();
});

// method to return a more concise set of info to the user
JobSchema.method('limitedJSON', function(){
    return {
        'id': this.id,
        'status': this.status,
        'url': this.url
    };
});

JobSchema.method('inProgress', function(){
    this.set('status', 'in process');
    this.set('updatedAt', new Date());
    return this.save();
});

JobSchema.method('complete', function(){
    this.set('status', 'complete');
    this.set('updatedAt', new Date());
    return this.save();
});

JobSchema.method('error', function(err){
    this.set('response', err);
    this.set('status', 'error');
    this.set('updatedAt', new Date());
    return this.save();
});

module.exports = mongoose.model('Job', JobSchema);
