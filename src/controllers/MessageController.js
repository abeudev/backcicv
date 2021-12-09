const mongoose = require('mongoose');
const Message = require('../models/Message');

//new conv
exports.create = async (req, res, next) => {

          const newMessage = new Message(req.body);
          try {
    
            const savedMessage = await newMessage.save();
            res.status(200).json({
              success: true,
              status: 200,
              data: savedMessage,
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
exports.getMessageBySenderreceived = async (req, res) => {
  try {
    
      let messages1 = await Message.find({sender: req.params.id})
      if (messages1.length === 0){
        let messages = await Message.find({received: req.params.id});
     
        res.json({
          success: true,
          conversationMsg: messages,
          
      })
      
      }
      else{
  
        res.json({
          success: true,
          conversationMsg: messages1
      })
      
      }
      
  }
 
    catch(err) {
        res.status(400).json({
            success: false,
            status: 400,
            data: err,
            message: err.message
        });
    }
};


exports.getConversationtwo = async (req, res) => {
  
  try {
   
        let messages = await Message.find({received: req.params.received,sender: req.params.sender});

        res.json({
          success: true,
          conversationTwo: messages,
          
      })
      
   
      
  }
 
    catch(err) {
        res.status(400).json({
            success: false,
            status: 400,
            data: err,
            message: err.message
        });
    }
};
