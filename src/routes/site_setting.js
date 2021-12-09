const router = require('express').Router();
const auth = require('../libraries/auth');
const SiteSettingController = require('../controllers/SiteSettingController');

router.put('/', auth.required,SiteSettingController.update);

router.get('/', auth.required, SiteSettingController.detail);

module.exports = router;