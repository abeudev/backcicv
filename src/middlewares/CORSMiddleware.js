
const response = (req, res, next) => { 
		const whitelist = ['http://localhost:8080'];
		const origin = req.headers.origin;
		if (whitelist.includes(origin)) {
			res.setHeader('Access-Control-Allow-Origin', origin);
		}
  	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
		res.setHeader('Access-Control-Allow-Credentials', 'true');

  	next();
}

module.exports = response;
