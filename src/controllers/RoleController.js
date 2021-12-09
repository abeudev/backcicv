const mongoose = require('mongoose');

const datatable = require('../libraries/datatable/Datatable');
const tableFilter = require('../libraries/datatable/Filter');

const Role = require('../models/Role');
const User = require('../models/User');

/**
 * Create role 
 */
exports.create = (req, res) => {
    const role = new Role();
    role.assignData(req.body);

    role.save()
        .then(saved_role => {
            res.status(200).json({
                success: true,
                status: 200,
                data: saved_role,
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
    let pipeline = table.generate_pipeline();
    
    Role.aggregate(pipeline)
        .then(role => {
            res.status(200).json({
                success: true,
                status: 200,
                data: table.result(role),
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
 * View detaill by id
 */
exports.detail_by_id = (req, res) => {
    Role.findById(mongoose.Types.ObjectId(req.params.roleID))
        .then((role) => {
            res.status(200).json({
                success: true,
                status: 200,
                data: role.toJSON(),
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

/**
 * Update role
 * @param {*} req 
 * @param {*} res 
 */
exports.update = (req, res) => {
    Role.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        {omitUndefined :true,  runValidators: true, context: 'query'})
        .then(role => {
            res.status(200).json({
                success: true,
                status: 200,
                data: role.toJSON(),
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
 * Load roles as options for selection purphose
 */
exports.options = (req, res) => {
    Role.find({
            isActive: true,
            level: { $gte: req.user.roleLevel }
        })
        .then(roles => {
            roles = roles.map(role => {
               return {
                   text : role.name,
                   value : role._id
               }
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: roles,
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

/**
 * Check which users using the role
 */
exports.check = (req, res) => {
  
    User.find({ roleID: req.params.roleID }, { username: 1, firstName: 1, lastName: 1 })
        .then(users => {
            res.status(200).json({
                success: true,
                status: 200,
                data: users,
                message: "Successfully retrieved Users"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: "Failed retrieve Users"
            });
        })
};


/**
 * Load Users as options for selection purphose
 */
 exports.options2 = (req, res) => {
    User.find({
            isActive: true
           
        }) // mettre un filtre pour ne pas afficher ni les agents, ni les admins
        .then(users => {
            users = users.map(user => {
               return {
                   text : user.username,
                   value : user._id
               }
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: users,
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


exports.tchatUsers = (req, res) => {
    // let User = await User.findById(req.body._id);
    // if (req.body.status) {
    //     req.body.status == colis.status? sendMessage=false:sendMessage=true
    // }
    User.find({ _id: {$ne: mongoose.Types.ObjectId(req.user.userID)} } ) // mettre un filtre pour ne pas afficher ni les agents, ni les admins
        .then(users => {
            users = users.map(user => {
               return {
                   name : user.username,
                   active : user.isActive,
                   avatar: user.avatar,
                   userid: user._id,
                   chatData: []
               }
            });
            res.status(200).json({
                success: true,
                status: 200,
                data: users,
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
