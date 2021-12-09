const mongoose = require('mongoose');
/**
 * This helper will generate front end request into certain mongodb pipeline query
 * 
 * 
 * 
 * Front end request example : 
 * {
 *      "filter": {
 *          "$match": {
 *          "isActive": true,
 *          "startDate": {"$date": 1593239298079},
 *          "userID": {"$oid": "5ef6e70144f554184db82b1b"},
 *          "isPending": {"$exists": false}
 *          }
 *      }
 * }
 */
class Filter {
    constructor(req) {
        this.req = req;
    }
    /**
     * This method will generate $match query in a pipeline
     */
    get_match() {
        if (this.req.$match) {
            return convert_special(this.req.$match);
        }
        return null;
    }
}

/**
 * 
 *  This function will convert field with object key $oid to ObjectId, and $date to Date
 */
function convert_special(obj) {
    for (let k in obj) {
        if (typeof obj[k] == "object" && obj[k] !== null) {
            if('$date' in obj[k]) {
                obj[k] = new Date(obj[k].$date);
            }
            else if('$oid' in obj[k]) {
                obj[k] = mongoose.Types.ObjectId(obj[k].$oid);
            }
            else {
                convert_special(obj[k]);
            }
        }
    }
    return obj;
}

module.exports = Filter;