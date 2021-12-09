const express = require('express');
const bodyParser = require('body-parser')
var cors = require('cors');
const	errorhandler = require('errorhandler');
const	config = require('./config');
const	mongoose = require('mongoose');
const	expressip = require('express-ip');
const errorHandler = require('./middlewares/NotFoundMiddleware');
const { Server } = require('socket.io');
const http = require('http');
// var appp = require('express')();
// var http = require('http').Server(appp);
const appp = express();
const server = http.createServer(appp);

const io = new Server(server, {
    cors:{
        origin: "*",
        methods: ['GET', "POST"]
    }
});

io.on('connection', (socket)=>{
    console.log(`user ${socket.id} is connected.`)

    socket.on('message',data =>{
        socket.broadcast.emit('message:received', data)

    })

    socket.on('disconnect', ()=>{
        console.log(`user ${socket.id} left.`)
    })
})


const isProduction = process.env.NODE_ENV === 'production';

/**
 * Create global app object
 */
const app = express();

if (!isProduction) {
  app.use(errorhandler());
}

// app.enable('trust proxy')
// app.use((req, res, next) => {
//     req.secure ? next() : res.redirect('https://' + req.headers.host + req.url)
// })

/********* CORS cross origin  */
app.use(cors());

/**
 * Init Body Parser to control request body
 */
app.use(bodyParser.json({
	limit: '10mb',
	extended: true
}));

app.use(bodyParser.urlencoded({
  limit: '10mb',
  parameterLimit: 100000,
  extended: true 
}));

/**
 * Connect Database
 */
let db = config.database;
let db_url = `${db.url}/${db.dbname}`;
if(db.username) {
	let user = `${db.username}:${db.password}@`
	db_url = user + db_url;
}
mongoose
	.connect('mongodb+srv://devUser:devUserPassword@clusterdev.imggk.mongodb.net/cicv2', {
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
		useUnifiedTopology: true
	})
	.catch(error => {
		console.log(error);
	});

/**
 * Init Routes and Middlewares
 */
app.use(require('./middlewares'));
app.use(expressip().getIpInfoMiddleware);

/**
 * Init static folder
 */
app.use(express.static(__dirname + '/public'));
app.use(require('./routes'));
app.use(errorHandler.not_found);
app.use(errorHandler.error_handler);

/**
 * Start the Server
 */
const server1 = app.listen(5000, () => {
	console.log('Listening on port ' + server1.address().port);
});


// server.listen(5000, () => {
//     console.log('Chat server is running in 5000')
// })
