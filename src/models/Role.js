const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const RoleSchema = new mongoose.Schema({
    name : {
        type : String,
        unique: true,
        required: [true, "can't be blank"],
        uniqueCaseInsensitive: true
    },
    level: Number,
    permissions : [
        {
            name : String,
            title : String,
            access : {
                type : String,
                enum : ['read', 'write', 'admin'],
                default : 'read'
            }
        }
    ],
    type: {
        type: String,
        default: 'user'
    },
    isActive : Boolean
}, {timestamps: true, versionKey : false});

RoleSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} roleData 
 */
RoleSchema.methods.assignData = function (roleData) {
    this.name = roleData.name;
    this.permissions = roleData.permissions;
    this.isActive = true;
    this.level = roleData.level ? roleData.level : 0 ;
    this.type = roleData.type;
};

RoleSchema.methods.toJSON = function () {
    return {
        _id: this._id,
        name : this.name,
        permissions : this.permissions,
        level : this.level,
        type : this.type,
        isActive : this.isActive
    };
};

module.exports = mongoose.model('Role', RoleSchema, 'role');