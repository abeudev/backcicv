const mongoose = require('mongoose');

const FileAssetSchema = new mongoose.Schema({
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    filename: String,
    path: String,
    size: Number,
    userID: {
      type: mongoose.Schema.ObjectId
    }
}, { timestamps: true, versionKey : false });

FileAssetSchema.index({ originalname: 1 }, { unique: true })

/**
 * Assign data
 * @param {Object} fileAsset 
 */
FileAssetSchema.methods.assignData = function (fileAsset) {
    this.fieldname = fileAsset.fieldname;
    this.originalname = fileAsset.originalname;
    this.encoding = fileAsset.encoding;
    this.mimetype = fileAsset.mimetype;
    this.filename = fileAsset.filename;
    this.path = fileAsset.path;
    this.size = fileAsset.size;
    this.userID = fileAsset.userID;
};

FileAssetSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        fieldname: this.fieldname,
        originalname: this.originalname,
        encoding: this.encoding,
        mimetype: this.mimetype,
        filename: this.filename,
        path: this.path,
        size: this.size,
        userID: this.userID
    };
};

module.exports = mongoose.model('FileAsset', FileAssetSchema, 'fileAsset');