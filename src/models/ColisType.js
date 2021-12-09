const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const ColisTypeSchema = new mongoose.Schema({
    name : String,
    description: String,
    isActive : Boolean
}, {timestamps: true, versionKey : false});

ColisTypeSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} ColisTypeData 
 */
ColisTypeSchema.methods.assignData = function (colisTypeData) {
    this.name = colisTypeData.name;
    this.description = colisTypeData.description;
    this.isActive = colisTypeData.isActive?   colisTypeData.isActive : true;
};

ColisTypeSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('ColisType', ColisTypeSchema, 'colisType');