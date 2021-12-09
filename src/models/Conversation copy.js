const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
    message : String,
    client: String,// transform to foreign key
    cicv:String // transform to foreign key
    // ajouter le type (suggestion ou reclamation)

}, {timestamps: true, versionKey : false});


/**
 * Assign data
 * @param {Object} ConversationData 
 */
ConversationSchema.methods.assignData = function (conversationData) {
    this.message = conversationData.message;
    this.client = conversationData.client;
    this.cicv = conversationData.cicv;
};

ConversationSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        message : this.message,
        client : this.client,
        cicv : this.cicv
    };
};

module.exports = mongoose.model('Conversation', ConversationSchema, 'conversation');