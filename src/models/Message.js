const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

  sender: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  received: {
    type: mongoose.Schema.ObjectId,
    ref: "User"
  },
  message: {
    type: String,
  },
  created: {
    type: String,
  },
  createdAt:{
    type: String,
  },
  
  isSelf:{
    type: Boolean
  },
  sendbyMe:{
    type: String
 
  },
  notme:{
    type: Boolean,
    default:true
  }

 // chatData: [],

  

}, {
  timestamps: true,
  versionKey: false
});


/**
 * Assign data
 * @param {Object} MessageData 
 */
MessageSchema.methods.assignData = function (messageData) {
  this.sender = messageData.sender;
  this.received = messageData.received;
  this.message = messageData.message;
    this.created = messageData.created;
  this.createdAt = messageData.createdAt;
  this.isSelf = messageData.isSelf;
  this.sendbyMe = messageData.sendbyMe;
  this.notme = messageData.notme;
};

MessageSchema.methods.toJSON = function () {
  return {
    _id: this._id,
    sender: this.sender,
    received: this.received,
    message: this.message,
    created: this.created,
    createdAt: this.createdAt,
    isSelf: this.isSelf,
    sendbyMe: this.sendbyMe,
    notme: this.notme,
  };
};


module.exports = mongoose.model('Message', MessageSchema, 'message');