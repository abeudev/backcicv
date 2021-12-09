const router = require('express').Router();
const auth = require('../libraries/auth');
const Warehouse = require('../controllers/WarehouseController');

router.post('/', auth.required, Warehouse.create);

router.put('/', auth.required,  Warehouse.update);

router.post('/table', auth.required,  Warehouse.table);

router.get('/:warehouseID', auth.required,  Warehouse.detail_by_id);

router.delete('/:warehouseID', auth.required,  Warehouse.delete_by_id);

module.exports = router;
