const mongoose = require('mongoose');

const WarehouseSchema = new mongoose.Schema({
    name : String,
    description: String,
    location: {
        streetName: String,
        city: Number,
        state: Number,
        country: Number,
        postalCode: String
    },
    isActive : Boolean
    //attribuer un agent à un entrepôt [agent 1, agent 2, ...]

}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} WarehouseData 
 */
WarehouseSchema.methods.assignData = function (warehouseData) {
    this.name = warehouseData.name;
    this.description = warehouseData.description;
    this.location = warehouseData.location;
    this.isActive = warehouseData.isActive;
};

WarehouseSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        description : this.description,
        location : this.location,
        isActive : this.isActive,
    };
};

module.exports = mongoose.model('Warehouse', WarehouseSchema, 'warehouse');