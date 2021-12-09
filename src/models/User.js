const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config');
const moment = require('moment-timezone');
const uniqueValidator = require('mongoose-unique-validator');

const SiteSetting = require('../models/SiteSetting');

const UserSchema = new mongoose.Schema({
		username: {
				type: String,
				// lowercase: true, 
				// unique: true, 
				// required: [true, "can't be blank"],
				// uniqueCaseInsensitive: true,
				// match: [/^[a-zA-Z0-9]+$/, 'is invalid']
			
		},
		email: {
				type: String, 
				lowercase: true, 
				// unique: true, 
				// required: [true, "can't be blank"], 
				// match: [/\S+@\S+\.\S+/, 'is invalid'], 
				index: true,
				// uniqueCaseInsensitive: true
		},
		firstName: {
				type: String,
				// required: [true, "can't be blank"],
		},
		phone: String,
		image: String,
		avatar: String,
		useImage: Boolean,
		gender: {
				type: String,
				enum: ["male", "female"],
				default: "male"
		},
		address: {
				streetName: String,
				city: Number,
				state: Number,
				country: Number,
				postalCode: String
		},
		lastName: String,
		password: String,
		isPending:  {
			type: Boolean,
			default: true
		},
		isActive:  {
			type: Boolean,
			default: false
		},
		isAgent:  {
			type: Boolean,
			default: false
		},
		isClient: {
			type: Boolean,
			default: true
		},
		isDeliveryMan:{
			type: Boolean,
			default: false
		},
		roleID: {
				type: mongoose.Schema.ObjectId,
				ref: "Role",
				default: '60d053b9731bbb5eec5d423f'
		},
		otp:String,
		dateOfBirth: Date,
}, { timestamps: true, versionKey: false });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

/**
 * Assign data
 * @param {Object} userData 
 * @returns {Promise}
 */
UserSchema.methods.assignData = function (userData) {
		return new Promise(async resolve => {
				this.username = userData.username;
				this.firstName = userData.firstName;
				this.lastName = userData.lastName;
				this.dateOfBirth = userData.dateOfBirth;
				this.email = userData.email;
				this.gender = userData.gender;
				this.phone = userData.phone;
				this.address = userData.address;
				this.avatar = userData.avatar;
				this.useImage = false;
				this.isPending = userData.isPending;
				this.isActive = userData.isActive;
				this.isClient=userData.isClient;
				this.isAgent=userData.isAgent;
				this.isDeliveryMan=userData.isDeliveryMan;
				this.password = bcrypt.hashSync(userData.password, 10);
				this.roleID = await this.setRole(userData.roleID);
				this.otp = userData.otp;
				resolve();
		});
};

/**
 * Set Role
 * @param {String} roleID 
 * @returns {Promise}
 */
UserSchema.methods.setRole = function (roleID) {
		return new Promise((resolve, reject) => {
				if(roleID) {
						resolve(roleID);
				} else {
						SiteSetting.findOne({})
								.then(setting => {
										resolve(setting.session.defaultRoleID);
								}).catch(err => {
										console.log(err)
										reject(null)
						});
				}
		});
};

UserSchema.methods.toJSON = function(){
		return {
				_id: this._id,
				username: this.username,
				email: this.email,
				address: this.address,
				gender: this.gender,
				image: this.image,
				phone: this.phone,
				firstName: this.firstName,
				lastName: this.lastName,
				isPending: this.isPending,
				isActive: this.isActive,
				isClient:this.isClient,
				isAgent:this.isAgent,
				isDeliveryMan:this.isDeliveryMan,
				dateOfBirth: this.dateOfBirth ? parseInt(moment(this.dateOfBirth).format('x')) : this.dateOfBirth,
				avatar: this.avatar,
				useImage: this.useImage,
				roleID: this.roleID,
				otp: this.otp
		};
};

/**
 * Generate JWT
 * @param {Object} userData 
 * @param {Integer} expiresIn 
 */
UserSchema.methods.generateJWT = function (userData, expiresIn) {
		const verifyOptions = {
				issuer:  'issuer',
				algorithm:  "HS256",
				expiresIn: expiresIn
		};

		const token_data = {
				userID: userData._id.toString(),
				username: userData.username,
				roleLevel: userData.roleID.level
		};
		return jwt.sign(token_data, config.jwt.secret, verifyOptions)
};

/**
 * Generate temporary JWT 30 min
 * @param {Object} userData 
 * @param {Integer} expiresIn 
 */
UserSchema.methods.generateTemporaryJWT = function () {
		const today = new Date();

		const verifyOptions = {
				issuer:  'issuer',
				algorithm:  "HS256"
		};

		const token_data = {
				userID: this._id.toString(),
				exp: parseInt((today.getTime() + 30 * 60000) / 1000)
		};

		return jwt.sign(token_data, config.jwt.temporary, verifyOptions)
};

module.exports = mongoose.model('User', UserSchema, 'users');