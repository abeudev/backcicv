const router = require('express').Router();
const auth = require('../libraries/auth');
const UserLogController = require('../controllers/UserLogController');

router.post('/table', auth.required, UserLogController.table);

module.exports = router;