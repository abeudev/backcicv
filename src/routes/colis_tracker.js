const router = require('express').Router();
const auth = require('../libraries/auth');
const ColisTracker = require('../controllers/ColisTrackerController');



router.post('/', ColisTracker.create);

router.put('/',  ColisTracker.update);



router.post('/table',  ColisTracker.table);



router.get('/:colisTrackerID',  ColisTracker.detail_by_id);
router.delete('/:colisTrackerID',  ColisTracker.delete_by_id);


module.exports = router;
