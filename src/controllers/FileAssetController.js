const mongoose = require('mongoose');
const datatable = require('../libraries/datatable/Datatable');
const tableFilter = require('../libraries/datatable/Filter');
const config = require('../config');
const FileAsset = require('../models/FileAsset');
const appDir = require('path').dirname(require.main.filename);
const fs = require('fs');

/**
 * Upload file to public dir and save file data
 */
exports.create = (req, res) => {
    const asset = new FileAsset();
    let data = req.file;
    data.path = data.path.replace(appDir + '/public', config.server);
    data.userID = req.user.userID;
    asset.assignData(data);
    asset.save()
        .then(saved_asset => {
            res.status(200).json({
                success: true,
                status: 200,
                data: saved_asset,
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

/**
 * Load table data using Datatable library
 */
exports.table = (req,res, next) => {
    const table = new datatable(req.body.datatable);
    if(req.body.filter) {
        const filter = new tableFilter(req.body.filter);
        if(filter.get_match()) {
            let custom_query = [{$match: filter.get_match()}];
            table.set_custom_query(custom_query);
        }
    }
    table.set_custom_query([
      {$lookup: {
        from: 'users',
        let: {userID: '$userID'},
        pipeline: [
          {$match: {$expr: {$eq: ['$_id', '$$userID']}}},
          {$project: {username: 1, userID: '$$userID'}}
        ],
        as: 'user'
      }},
      {$unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true
      }}
    ])
    const pipeline = table.generate_pipeline();
    
    FileAsset.aggregate(pipeline)
        .then(asset => {
            res.status(200).json({
                success: true,
                status: 200,
                data: table.result(asset),
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

/**
 * Delete file and record from db
 * @param {*} req 
 * @param {*} res 
 */
exports.delete_by_id = (req, res) => {
    FileAsset.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.fileID))
        .then(asset => {
          let filepath = asset.path.replace(config.server, appDir+'/public')
          fs.unlinkSync(filepath)
          res.status(200).json({
              success: true,
              status: 200,
              data: filepath,
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


