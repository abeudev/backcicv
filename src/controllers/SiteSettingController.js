const SiteSetting = require('../models/SiteSetting');

/**
 * Update Site Settings
 */
exports.update = (req, res) => {
    SiteSetting.findOne()
        .then(setting =>{
            if(!setting) {
                const newSetting = new SiteSetting();
                newSetting.assignData(req.body);
                newSetting.save()
                    .then(save => {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            data: newSetting,
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

            } else {
                SiteSetting.updateOne(
                    {_id: setting._id},
                    {$set: req.body},
                    {omitUndefined: true})
                    .then(update => {
                        res.status(200).json({
                            success: true,
                            status: 200,
                            data: req.body,
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
                    })
            }
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
        })
};

/**
 * Find Site Settings details
 * @param {*} req 
 * @param {*} res 
 */
exports.detail = (req, res) => {
    SiteSetting.findOne()
        .then(setting => {
            let siteSetting = new SiteSetting();
            res.status(200).json({
                success: true,
                status: 200,
                data: !setting ? siteSetting.default() : setting,
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
            res.status(400).json(err);
        })
};