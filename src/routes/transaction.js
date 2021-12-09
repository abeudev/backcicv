const router = require('express').Router();
const auth = require('../libraries/auth');
const Transaction = require('../controllers/TransactionController');



router.post('/',auth.required, Transaction.create);

router.put('/', auth.required, Transaction.update);

router.post('/table',auth.required,  Transaction.table);

router.get('/options', auth.required, Transaction.options);
router.get('/:transactionID', auth.required, Transaction.detail_by_id);
router.get('/:factureID', auth.required, Transaction.facture);
router.delete('/:transactionID', auth.required, Transaction.delete_by_id);


module.exports = router;
