const router = require('express').Router();
const auth = require('../libraries/auth');
const RoleController = require('../controllers/RoleController');


router.post('/', auth.required, RoleController.create);

router.put('/', auth.required, RoleController.update);

router.post('/table', auth.required, RoleController.table);

router.get('/options', auth.required, RoleController.options);

router.get('/options2', auth.required, RoleController.options2);
router.get('/tchatusers/:user_id', auth.required, RoleController.tchatUsers);
router.get('/:roleID', auth.required, RoleController.detail_by_id);

router.get('/:roleID/users', auth.required, RoleController.check);

module.exports = router;