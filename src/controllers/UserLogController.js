const datatable = require('../libraries/datatable/Datatable');
const tableFilter = require('../libraries/datatable/Filter');
const UserLog = require('../models/UserLog');

/**
 * Load table data using Datatable library
 */
exports.table = (req,res) => {
    const table = new datatable(req.body.datatable);
    if(req.body.filter) {
        const filter = new tableFilter(req.body.filter);
        if(filter.get_match()) {
            let custom_query = [{$match: filter.get_match()}];
            table.set_custom_query(custom_query);
        }
    }
    let pipeline = table.generate_pipeline();

    UserLog.aggregate(pipeline)
        .then(logs=> {
            res.status(200).json({
                success: true,
                status: 200,
                data: table.result(logs),
                message: ""
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        });
};