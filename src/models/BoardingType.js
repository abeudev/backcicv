const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const BoardingTypeSchema = new mongoose.Schema({
    name : String,
    description: String,
    isActive : Boolean
}, {timestamps: true, versionKey : false});

BoardingTypeSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} BoardingTypeData 
 */
BoardingTypeSchema.methods.assignData = function (boardingTypeData) {
    this.name = boardingTypeData.name;
    this.description = boardingTypeData.description;
    this.isActive =  boardingTypeData.isActive? boardingTypeData.isActive: true;
};

BoardingTypeSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('BoardingType', BoardingTypeSchema, 'boardingType');