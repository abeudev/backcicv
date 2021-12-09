const router = require('express').Router();
const auth = require('../libraries/auth');
const FeedController = require('../controllers/FeedController');

router.post('/', auth.required, FeedController.create);

router.put('/', auth.required, FeedController.update);

router.post('/table', auth.required, FeedController.table);

router.get('/options', auth.required, FeedController.options);

router.get('/all-tags', auth.required, FeedController.find_all_tags);

router.get('/:feedID', auth.required, FeedController.detail_by_id);

module.exports = router;