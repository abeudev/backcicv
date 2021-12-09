const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const TypeOperation = require('../models/TypeOperation');


/**
 * Load table data using Datatable library
 * Get typeOperations who have same and greater role level number
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
    
    TypeOperation.aggregate(pipeline)
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
 * Create a TypeOperation 
 */
exports.create = async (req, res, next) => {
    const typeOperation = new TypeOperation();
    await typeOperation.assignData(req.body);
    typeOperation.isActive = true;
    typeOperation.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: typeOperation.toJSON(),
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
 * Update TypeOperation
 * 
 */
exports.update = (req, res, next) => {
    TypeOperation.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((typeOperation) => {
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
 * Find typeOperation by id 
 */
exports.detail_by_id = (req, res, next) => {
    TypeOperation.findById(mongoose.Types.ObjectId(req.params.typeOperationID))
        .then(typeOperation => {
            res.status(200).json({
                success: true,
                status: 200,
                data: typeOperation,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'TypeOperation not found'
            });
        })
};

/**
 * Delete typeOperation and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    TypeOperation.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.typeOperationID))
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
