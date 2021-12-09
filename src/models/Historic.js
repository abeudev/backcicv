const mongoose = require('mongoose');

const HistoricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  historics: [{
    type: mongoose.Schema.ObjectId,
    ref: "Colis"
  }],
}, {
  timestamps: true,
  versionKey: false
});


/**
 * Assign data
 * @param {Object} HistoricData 
 */
HistoricSchema.methods.assignData = function (historicData) {
  this.userId = historicData.userId;
  this.sender = historicData.sender;
  this.text = historicData.text;
};

HistoricSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    userId: this.userId,
    sender: this.sender,
    text: this.text
  };
};

module.exports = mongoose.model('Historic', HistoricSchema, 'historic');