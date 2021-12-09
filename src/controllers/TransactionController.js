const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Transaction = require('../models/Transaction');


/**
 * Load table data using Datatable library
 * Get transactions who have same and greater role level number
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
    
    
    Transaction.aggregate(pipeline)
      .then(transaction => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(transaction),
            message: ""
        });
        console.log(table.result(transaction));
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


exports.facture = (req, res, next) => {
    Transaction.findById(mongoose.Types.ObjectId(req.params.transactionID))
        .then(transaction => {
            res.status(200).json({
                success: true,
                status: 200,
                data: transaction,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Transaction not found'
            });
        })
};


/**
 * Create a Transaction 
 */
exports.create = async (req, res, next) => {
    const transaction = new Transaction();
    await transaction.assignData(req.body);
    transaction.isActive = true;
    transaction.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: transaction.toJSON(),
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
 * Update Transaction
 * 
 */
exports.update = (req, res, next) => {
    Transaction.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((transaction) => {
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
 * Find transaction by id 
 */
exports.detail_by_id = (req, res, next) => {
    Transaction.findById(mongoose.Types.ObjectId(req.params.transactionID))
        .then(transaction => {
            res.status(200).json({
                success: true,
                status: 200,
                data: transaction,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Transaction not found'
            });
        })
};

/**
 * Delete transaction and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Transaction.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.transactionID))
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


/**
 * Load Transaction as options for selection purphose
 */

//@
 exports.options = (req, res) => {
    Transaction.find({
            isActive: true
           
        }) // mettre un filtre pour ne pas afficher ni les agents, ni les admins
        .then(transactions => {
            transactions = transactions.map(transaction => {
               return {
                 departure: transaction.departure_place.streetName,
                arrive:transaction.arrival_place.streetName,
                    text : transaction.departure_place.streetName+" "+transaction.arrival_place.streetName+" "+transaction.arrival_date,
                   value : transaction._id,
                //    text:transaction.arrival_date
                  
               }
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: transactions,
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
};