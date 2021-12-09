const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Warehouse = require('../models/Warehouse');


/**
 * Load table data using Datatable library
 * Get warehouses who have same and greater role level number
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
    
    Warehouse.aggregate(pipeline)
      .then(warehouse => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(warehouse),
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
 * Create a Warehouse 
 */
exports.create = async (req, res, next) => {
    const warehouse = new Warehouse();
    await warehouse.assignData(req.body);
    warehouse.isActive = true;
    warehouse.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: warehouse.toJSON(),
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
 * Update Warehouse
 * 
 */
exports.update = (req, res, next) => {
    Warehouse.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((warehouse) => {
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
 * Find warehouse by id 
 */
exports.detail_by_id = (req, res, next) => {
    Warehouse.findById(mongoose.Types.ObjectId(req.params.warehouseID))
        .then(warehouse => {
            res.status(200).json({
                success: true,
                status: 200,
                data: warehouse,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Warehouse not found'
            });
        })
};

/**
 * Delete warehouse and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Warehouse.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.warehouseID))
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
