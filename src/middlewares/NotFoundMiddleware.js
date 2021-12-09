exports.not_found = (req, res, next) => {
		let error = new Error('not found')
		error.status = 404;
		next(error)	
};

exports.error_handler = (error, req, res, next) => {
		res.status(error.status || 500).json({
				success: false,
				status: error.status || 500,
				data: error,
				message: error.message
		});
};