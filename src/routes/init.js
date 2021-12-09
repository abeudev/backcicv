const router = require('express').Router();
const InitController = require('../controllers/InitController');

router.post('/', InitController.install);

router.get('/', InitController.check);

module.exports = router;