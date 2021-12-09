const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    members: [{
     
        type: mongoose.Schema.ObjectId,
				ref: "User"
      }],
}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} ConversationData 
 */
ConversationSchema.methods.assignData = function (conversationData) {
    this.members = conversationData.members;
};

ConversationSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        members : this.members,
    };
};

module.exports = mongoose.model('Conversation', ConversationSchema, 'conversation');