const router = require('express').Router();
const auth = require('../libraries/auth');
const BoardingType = require('../controllers/BoardingTypeController');



router.post('/', BoardingType.create);

router.put('/',  BoardingType.update);



router.post('/table',  BoardingType.table);



router.get('/:boardingTypeID',  BoardingType.detail_by_id);
router.delete('/:boardingTypeID',  BoardingType.delete_by_id);


module.exports = router;
