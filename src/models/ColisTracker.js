const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const ColisTrackerSchema = new mongoose.Schema({
    name : String,
    description: String,
    status: String,
    trackNumber: { type: String,unique: true ,  required:[true, "trackNumber can't be blank"]},//unique
    provider: String,// ajouter le fournisseur(amazon, alibaba...)
    isActive : Boolean 
}, {timestamps: true, versionKey : false});

ColisTrackerSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} ColisTrackerData 
 */
ColisTrackerSchema.methods.assignData = function (colisTrackerData) {
    this.name = colisTrackerData.name;
    this.trackNumber = colisTrackerData.trackNumber;
    this.description = colisTrackerData.description;
    this.status = colisTrackerData.status;
    this.provider = colisTrackerData.provider;
    this.isActive = colisTrackerData.isActive? colisTrackerData.isActive : true;
};

ColisTrackerSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        status: this.status,
        trackNumber: this.trackNumber,
        provider: this.provider,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('ColisTracker', ColisTrackerSchema, 'colisTracker');