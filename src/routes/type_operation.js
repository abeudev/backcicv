const router = require('express').Router();
const auth = require('../libraries/auth');
const TypeOperation = require('../controllers/TypeOperationController');



router.post('/', TypeOperation.create);

router.put('/',  TypeOperation.update);



router.post('/table',  TypeOperation.table);



router.get('/:typeOperationID',  TypeOperation.detail_by_id);
router.delete('/:typeOperationID',  TypeOperation.delete_by_id);


module.exports = router;
