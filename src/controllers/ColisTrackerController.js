const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const ColisTracker = require('../models/ColisTracker');


/**
 * Load table data using Datatable library
 * Get colisTrackers who have same and greater role level number
 */
exports.table = (req,res, next) => {
    const table = new Datatable(req.body.datatable);
    if(req.body.filter) {
      const filter = new TableFilter(req.body.filter);
      if(filter.get_match()) {
        const custom_query = [{$match: filter.get_match()}];
        table.set_custom_query(custom_query);
      }
    }
    const pipeline = table.generate_pipeline();
    
    ColisTracker.aggregate(pipeline)
      .then(colis_tracker => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(colis_tracker),
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
 * Create a ColisTracker 
 */
exports.create = async (req, res, next) => {
    const colisTracker = new ColisTracker();
    await colisTracker.assignData(req.body);
    colisTracker.isActive = true;
    colisTracker.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colisTracker.toJSON(),
                message: "Success"
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
};


/**
 * Update ColisTracker
 * 
 */
exports.update = (req, res, next) => {
    ColisTracker.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((colisTracker) => {
            res.status(200).json({
                success: true,
                status: 200,
                data: req.body,
                message: "Success"
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
 * Find colisTracker by id 
 */
exports.detail_by_id = (req, res, next) => {
    ColisTracker.findById(mongoose.Types.ObjectId(req.params.colisTrackerID))
        .then(colisTracker => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colisTracker,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'ColisTracker not found'
            });
        })
};

/**
 * Delete colisTracker and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    ColisTracker.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.colisTrackerID))
        .then(asset => {
          res.status(200).json({
              success: true,
              status: 200,
              data: asset,
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
