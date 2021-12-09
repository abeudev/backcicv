const multer = require('multer');
const config = require('../../config');
const path = require('path');
const appDir = path.dirname(require.main.filename);

module.exports.storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appDir + config.upload.images);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + req.user.userID + '.jpg')
    },
    path: function (req, file, cb) {
        cb(null, file.path)
    }
});

module.exports.asset = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appDir + config.upload.assets);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname )
    }
});
