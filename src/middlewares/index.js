const express = require('express');
const app = express();

app.use(require('./CORSMiddleware'));

module.exports = app;