const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const ColisType = require('../models/ColisType');


/**
 * Load table data using Datatable library
 * Get colisTypes who have same and greater role level number
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
    
    ColisType.aggregate(pipeline)
      .then(type_operation => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(type_operation),
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
 * Create a ColisType 
 */
exports.create = async (req, res, next) => {
    const colisType = new ColisType();
    await colisType.assignData(req.body);
    colisType.isActive = true;
    colisType.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colisType.toJSON(),
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
 * Update ColisType
 * 
 */
exports.update = (req, res, next) => {
    ColisType.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((colisType) => {
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
 * Find colisType by id 
 */
exports.detail_by_id = (req, res, next) => {
    ColisType.findById(mongoose.Types.ObjectId(req.params.colisTypeID))
        .then(colisType => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colisType,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'ColisType not found'
            });
        })
};

/**
 * Delete colisType and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    ColisType.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.colisTypeID))
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
