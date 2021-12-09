const countries_json = require('./Country.json');
const states_json = require('./State.json');
const cities_json = require('./City.json');

exports.get_all_countries = () => {
    return countries_json;
};

exports.get_states_by_country = (countryID) => {
    const states = states_json.filter(state => {
        return state.country_id === countryID;
    });
    return states.sort(compare);
};

exports.get_cities_by_state = stateID => {
    const cities = cities_json.filter(city => {
        return city.state_id === stateID;
    });
    return cities.sort(compare);
};

function compare(a, b) {
    if (a.name < b.name)
        return -1;
    if (a.name > b.name)
        return 1;
    return 0;
}
