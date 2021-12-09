const router = require('express').Router();
const multer = require('multer');
const { asset } = require('../libraries/upload');
const upload = multer({storage :asset});

const FileAssetController = require('../controllers/FileAssetController');

const auth = require('../libraries/auth');

router.post('/uploads', auth.required, upload.single('file'), FileAssetController.create);

router.post('/table', auth.required, FileAssetController.table);

router.delete('/:fileID', auth.required, FileAssetController.delete_by_id);

module.exports = router;
