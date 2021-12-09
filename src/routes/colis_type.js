const router = require('express').Router();
const auth = require('../libraries/auth');
const ColisType = require('../controllers/ColisTypeController');



router.post('/', ColisType.create);

router.put('/',  ColisType.update);



router.post('/table',  ColisType.table);



router.get('/:colisTypeID',  ColisType.detail_by_id);
router.delete('/:colisTypeID',  ColisType.delete_by_id);


module.exports = router;
