const router = require('express').Router();
const auth = require('../libraries/auth');
const Conversation = require('../controllers/ConversationController');



router.post('/', Conversation.create);
router.get('/:userId', Conversation.getConvOfAUser);
router.get('/find/:firstUserId/:secondUserId', Conversation.getConvOfTwoUser);
router.delete('/:conversationID',  Conversation.delete_by_id);


module.exports = router;
