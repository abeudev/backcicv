const mongoose = require('mongoose');

const FeedSchema = new mongoose.Schema({
    title: {
        type : String,
        required: [true, "can't be blank"]
    },
    caption: String,
    image: String,
    tags: [String],
    isActive: Boolean
}, { timestamps: true, versionKey : false });

/**
 * Assign data
 * @param {Object} feedData
 */
FeedSchema.methods.assignData = function (feedData) {
    this.title = feedData.title;
    this.caption = feedData.caption;
    this.image = feedData.image;
    this.tags = feedData.tags;
    this.isActive = true;
};

FeedSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        title: this.title,
        caption: this.caption,
        image: this.image,
        tags: this.tags,
        isActive: this.isActive
    };
};

module.exports = mongoose.model('Feed', FeedSchema, 'feed');