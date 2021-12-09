const router = require('express').Router();
const CSCController = require('../controllers/CountryStateCityController');

router.get('/countries', CSCController.country_list);

router.get('/states', CSCController.states_by_country);

router.get('/cities', CSCController.cities_by_state);

module.exports = router;