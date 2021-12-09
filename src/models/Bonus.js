const mongoose = require('mongoose');
const { v4 : uuidv4 } = require('uuid');
const uniqueValidator = require('mongoose-unique-validator');

const BonusSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    value: {
        type: Number,
        default: 0
    },
 
}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} BonusData 
 */
BonusSchema.methods.assignData = function (bonusData) {
    this.userID = bonusData.userID;
    this.value = bonusData.value;
};

BonusSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        value : this.value,
    };
};

module.exports = mongoose.model('Bonus', BonusSchema, 'bonus');