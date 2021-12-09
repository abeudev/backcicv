const router = require('express').Router();
const auth = require('../libraries/auth');
const DashboardController = require('../controllers/DashboardController');

router.get('/weekly-login', auth.required, DashboardController.weeklyLogin);
router.get('/today-login', auth.required, DashboardController.todayLogin);
router.get('/count/users', auth.required, DashboardController.countUsers);
router.get('/count/roles', auth.required, DashboardController.countRoles);
router.get('/count/feeds', auth.required, DashboardController.countFeeds);
router.get('/count/assets', auth.required, DashboardController.countFileAssets);

module.exports = router;