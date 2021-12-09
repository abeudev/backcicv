const SiteSetting = require('../models/SiteSetting');
const User = require('../models/User');
const Role = require('../models/Role');

/**
 * Check wether the application is installed
 * by counting the user
 */
exports.check = (req, res) => {
    User.countDocuments({})
        .then(count => {
            res.status(200).json({
                success: true,
                status: 200,
                data: { isInstalled: count > 0 },
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
 * Initial installation.
 * Create superAdmin and default roles.
 * Assign the first user as superAdmin.
 * Set initial default settings.
 * @param {*} req 
 * @param {*} res 
 */
exports.install = async (req, res) => {
    const rolesData = [
        {
            ...req.body.role,
            level: -1,
            type: 'superAdmin'
        },
        {
            name: req.body.role.defaultRoleName,
            permissions: req.body.role.permissions,
            level: 0,
            type: 'default'
        }
    ]
    const roles = rolesData.map(data => {
        return new Promise((resolve, reject) => {
            const role = new Role();
            role.assignData(data);
            role.save((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        })
    });
    try {
        const savedRoles = await Promise.all(roles);
        const userPromise = new Promise((resolve, reject) => {
            const user = new User();
    
            req.body.user.roleID = savedRoles[0]._id;
            user.assignData(req.body.user);
            user.isActive = true;
            user.isPending = false;
            user.save((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        const siteSettings = new Promise((resolve, reject) => {
            const setting = new SiteSetting();
    
            setting.setInitialSetting(req.body.siteSettings);
            setting.session.defaultRoleID = savedRoles[1]._id;
            setting.contact.email = req.body.user.email;
            setting.save((error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
        await Promise.all([userPromise, siteSettings]);
        res.status(200).json({
            success: true,
            status: 200,
            data: req.body,
            message: ""
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            status: 400,
            data: err,
            message: err.message
        });
    };
};