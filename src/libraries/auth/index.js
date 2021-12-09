const config = require('../../config');
const jwt = require('express-jwt');

function getToken(req) {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === "Bearer") {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
}

const auth = {
    required: jwt({
        secret: config.jwt.secret,
        getToken: getToken
    }),
    temporary: jwt({
        secret: config.jwt.temporary,
        getToken : getToken,
    })
};

module.exports = auth;