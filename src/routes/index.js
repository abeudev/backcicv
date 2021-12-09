const router = require('express').Router();

router.use('/users', require('./user'));
router.use('/roles', require('./role'));
router.use('/settings', require('./site_setting'));
router.use('/', require('./country_state_city'));
router.use('/logs/users', require('./user_log'));
router.use('/init', require('./init'));
router.use('/feeds', require('./feed'));
router.use('/assets', require('./file_asset'));
router.use('/dashboard', require('./dashboard'));

/***** others routes */
router.use('/operationtype', require('./type_operation'));
router.use('/transaction', require('./transaction'));
router.use('/boardingtype', require('./boarding_type'));
router.use('/colistype', require('./colis_type'));
router.use('/colis', require('./colis'));
router.use('/warehouse', require('./warehouse'));
router.use('/conversation', require('./conversation'));
router.use('/message', require('./message'));
router.use('/colistracker', require('./colis_tracker'));
router.use('/users2', require('./user'));
module.exports = router;