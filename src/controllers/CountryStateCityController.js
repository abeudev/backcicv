const country = require('../libraries/country');

exports.country_list = (req, res, next) => {
    return res.json({countries : country.get_all_countries()})
};

exports.states_by_country = (req, res) => {
    let countryID = req.query.country_id;
    return res.json({states : country.get_states_by_country(countryID)});
};

exports.cities_by_state = (req, res) => {
    let stateID = req.query.state_id;
    return res.json({cities : country.get_cities_by_state(stateID)});
};