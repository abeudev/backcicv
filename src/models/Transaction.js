const mongoose = require('mongoose');
const moment = require('moment-timezone');

const TransactionSchema = new mongoose.Schema({

    departure_place: {
        streetName: String,
        city: Number,
        state: Number,
        country: Number,
        postalCode: String
    },
    arrival_place: {
        streetName: String,
        city: Number,
        state: Number,
        country: Number,
        postalCode: String
    },
    departure_date:Date,
    arrival_date:Date,
    isActive : Boolean
}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} transactionData 
 */
TransactionSchema.methods.assignData = function (transactionData) {
    this.departure_place = transactionData.departure_place;
    this.arrival_place = transactionData.arrival_place;
    this.departure_date = transactionData.departure_date ? transactionData.departure_date : Date.now() ;
    this.arrival_date = transactionData.arrival_date ? transactionData.arrival_date : Date.now() ;
    this.isActive = transactionData.isActive ? transactionData.isActive :true;
};

TransactionSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        departure_place : this.departure_place,
        arrival_place : this.arrival_place,
        departure_date : this.departure_date ? parseInt(moment(this.departure_date).format('x')) : this.departure_date,
        arrival_date : this.arrival_date ? parseInt(moment(this.arrival_date).format('x')) : this.arrival_date,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('Transaction', TransactionSchema, 'transaction');