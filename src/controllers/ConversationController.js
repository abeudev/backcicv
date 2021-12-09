const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Conversation = require('../models/Conversation');

//new conv
exports.create = async (req, res, next) => {
    const conversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
      });
    
          try {
            const savedConversation = await conversation.save();
            res.status(200).json({
                success: true,
                status: 200,
                data: savedConversation,
                message: "Success"
            });
          } catch (err) {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
          }
};
//get conv of a user
exports.getConvOfAUser = async (req, res, next) => {
          try {
            const conversation = await Conversation.find({
              members: { $in: [req.params.userId] },
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: conversation,
                message: "Success"
            });
          } catch (err) {
            res.status(500).json({
                success: false,
                status: 400,
                data: err,
                message: err.message
            });
          }
};
// get conv includes two userId
exports.getConvOfTwoUser = async (req, res, next) => {
    try {
      const conversation = await Conversation.find({
        members: { $all: [req.params.firstUserId, req.params.secondUserId] },
      });
      res.status(200).json({
          success: true,
          status: 200,
          data: conversation,
          message: "Success"
      });
    } catch (err) {
      res.status(500).json({
          success: false,
          status: 400,
          data: err,
          message: err.message
      });
    }
};

/**
 * Load table data using Datatable library
 * Get conversations who have same and greater role level number
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
    
    Conversation.aggregate(pipeline)
      .then(conversation => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(conversation),
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
 * Delete conversation and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Conversation.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.conversationID))
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
