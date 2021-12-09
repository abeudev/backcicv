const router = require('express').Router();
const auth = require('../libraries/auth');
const Message = require('../controllers/MessageController');



router.post('/', Message.create);
router.get('/:id', Message.getMessageBySenderreceived);
router.get('/:received/:sender', Message.getConversationtwo);

module.exports = router;
