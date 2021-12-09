const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const BoardingType = require('../models/BoardingType');


/**
 * Load table data using Datatable library
 * Get boarding_types who have same and greater role level number
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
    
    BoardingType.aggregate(pipeline)
      .then(boardingType => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(boardingType),
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
 * Create a BoardingType 
 */
exports.create = async (req, res, next) => {
    const boardingType = new BoardingType();
    await boardingType.assignData(req.body);
    boardingType.isActive = true;
    boardingType.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: boardingType.toJSON(),
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
 * Update BoardingType
 * 
 */
exports.update = (req, res, next) => {
    BoardingType.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((boardingType) => {
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
 * Find boardingType by id 
 */
exports.detail_by_id = (req, res, next) => {
    BoardingType.findById(mongoose.Types.ObjectId(req.params.boardingTypeID))
        .then(boardingType => {
            res.status(200).json({
                success: true,
                status: 200,
                data: boardingType,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'BoardingType not found'
            });
        })
};

/**
 * Delete boardingType and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    BoardingType.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.boardingTypeID))
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
