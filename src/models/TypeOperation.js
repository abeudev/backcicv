const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const TypeOperationSchema = new mongoose.Schema({
    name : {
        type : String,
        unique: true,
        required: [true, "Le champ nom est Obligatoire"],
        uniqueCaseInsensitive: true
    },
    description: String,
    isActive : Boolean
}, {timestamps: true, versionKey : false});

TypeOperationSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} TypeOperationData 
 */
TypeOperationSchema.methods.assignData = function (typeOperationData) {
    this.name = typeOperationData.name;
    this.description = typeOperationData.description;
    this.isActive = typeOperationData.isActive? typeOperationData.isActive : true;
};

TypeOperationSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('TypeOperation', TypeOperationSchema, 'typeOperation');