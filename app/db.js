// app/db.js
// db connnector helper. Verifies that we have a valid mongodb url

var mongoose = require("mongoose");

var DB = function () {

    // attempts to the connect the given mongoDB url string
    // dburl : mongoDB url String
    // callback: callback function
    var connect = function (dbUrl, callback) {
        // type check our db url
        if(dbUrl !== null && typeof dbUrl === "string" && dbUrl !== "") {
            console.log("connecting to database....");
            var connection = mongoose.connect(dbUrl, callback);
        } else {
            console.error(new Error("Error: provided Database Url is invalid"));
        }
    };

    return {
        connect: connect
    };

}();

module.exports = DB;
