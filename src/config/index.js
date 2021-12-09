module.exports = {
	server: 'http://localhost:5000',
	mockServer: 'https://ignore-this.mock.pstmn.io',
	frontEnd: {
		baseUrl : 'http://localhost:8080'
	},
	jwt: {
		secret: "bulAlwi-D-B0ullef@rD",
		temporary: 'S3iR0uslY-y0u-w1LL-neV3r-Kn0W'
	},
	database: {
		username: "username",
		password: "password",
		dbname: "dbname",
		url : "localhost:27017"
	},
	mail: {
		user: "your@mail.com",
		pass: "password"
	},
	upload: {
		images: '/public/images/',
		assets: '/public/assets/'
	},
	default: {
		siteSetting: {
			siteTitle: 'Africa/Abidjan',
			dateFormat: 'DD/MM/YYYY',
			timeFormat: '24hr',
			timezone: 'Asia/Jakarta',
			session: {
				unit: 'h',
				value: 24
			}
		}
	}
};