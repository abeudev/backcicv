const mongoose = require('mongoose');

const UserLogSchema = new mongoose.Schema({
    userID : {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    username: String,
    ip: String,
    userAgent: String,
    comment: String,
    success: Boolean,
}, { timestamps: true, versionKey : false });

/**
 * Assign Data
 * @param {Object} req 
 * @param {String} comment 
 * @param {String} userID 
 */
UserLogSchema.methods.logFailed = function (req, comment, userID) {
    this.username = req.body.username;
    this.permissions = req.body.permissions;
    this.ip = req.ip;
    this.userAgent = req.body.userAgent;
    this.comment = comment;
    this.success = false;
    if(userID) {
        this.userID= userID;
    }
};

/**
 * Assign Data
 * @param {Object} req 
 * @param {String} comment 
 * @param {String} userID 
 */
UserLogSchema.methods.logSuccess = function (req, comment, userID) {
    this.username = req.body.username;
    this.permissions = req.body.permissions;
    this.ip = req.ip;
    this.userAgent = req.body.userAgent;
    this.comment = comment;
    this.success = true;
    this.userID= userID;
};

UserLogSchema.methods.toJSON = function () {
    return {
        username: this.username,
        userID: this.userID
    };
};

module.exports = mongoose.model('UserLog', UserLogSchema, 'userLog');