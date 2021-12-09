const UserLog = require('../models/UserLog');
const User = require('../models/User');
const Role = require('../models/Role');
const Feed = require('../models/Feed');
const FileAsset = require('../models/FileAsset');
const SiteSetting = require('../models/SiteSetting');
const moment = require('moment-timezone');

/**
 * Summarize Users login weekly
 */
exports.weeklyLogin = async (req, res) => {
    const settings = await SiteSetting.findOne({});
    const startDate = moment().tz(settings.timeAndRegion.timezone).subtract(6, 'days').set({ hour: 0, minute: 0, second: 0 }).toDate();
    const endDate = moment().tz(settings.timeAndRegion.timezone).set({ hour: 23, minute: 59, second: 59 }).toDate();
    const weekly = UserLog.aggregate([
        {
            $match: {
                createdAt: {
                    $gt: startDate,
                    $lt: endDate
                }
            }
        },
        {
            $addFields: {
                day: {
                    $dateToString: {
                        format: '%d-%m-%Y',
                        date: '$createdAt',
                        timezone: settings.timeAndRegion.timezone
                    }
                },
                id: {
                    $dateToString: {
                        format: '%Y%m%d',
                        date: '$createdAt',
                        timezone: settings.timeAndRegion.timezone
                    }
                }
            }
        },
        {
            $group: {
                _id: '$id',
                value: { $first: '$day' },
                total: { $sum: 1 }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    weekly
        .then(logs => {
            res.status(200).json({
                success: true,
                status: 200,
                data: logs,
                message: "success"
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

exports.countUsers = async (req, res) => {
    const roleIds = await Role.distinct('_id', {level: { $gt: -1 }});
    User.find({isActive: true, roleID: { $in: roleIds }}).countDocuments()
        .then(data => {
            res.status(200).json({
                success: true,
                status: 200,
                data: data,
                message: "success"
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

exports.countRoles = (req, res) => {
    Role.find({isActive: true, level: { $gt: -1 }}).countDocuments()
        .then(data => {
            res.status(200).json({
                success: true,
                status: 200,
                data: data,
                message: "success"
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

exports.countFeeds = (req, res) => {
    Feed.find({isActive: true}).countDocuments()
        .then(data => {
            res.status(200).json({
                success: true,
                status: 200,
                data: data,
                message: "success"
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

exports.countFileAssets = (req, res) => {
    FileAsset.find({}).countDocuments()
        .then(data => {
            res.status(200).json({
                success: true,
                status: 200,
                data: data,
                message: "success"
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

exports.todayLogin = async (req, res) => {
    const settings = await SiteSetting.findOne({});
    const today = moment().tz(settings.timeAndRegion.timezone).set({ hour: 0, minute: 0, second: 0 }).toDate();
    const pipeline = [
        {
            $match: {
                createdAt: {
                    $gt: today
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                localField: 'username',
                foreignField: 'username',
                as: 'user'
            }
        },
        {
            $unwind: '$user'
        },
        {
            $project: {
                username: '$user.username',
                firstName: '$user.firstName',
                lastName: '$user.lastName',
                ip: 1,
                createdAt: {$subtract: ['$createdAt', new Date("1970-01-01T00:00:00Z")]},
                useImage: '$user.useImage',
                avatar: '$user.avatar',
                image: '$user.image'
            }
        }
    ];
    UserLog.aggregate(pipeline)   
        .then(data => {
            data.forEach(d => {
                const ip = d.ip;
                if (ip == '::1') d.ip = '-';
                if (ip && ip.indexOf('::ffff:') > -1) {
                d.ip = ip.substring(7);
                }
            })
            res.status(200).json({
                success: true,
                status: 200,
                data: data,
                message: "success"
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

