const mongoose = require('mongoose');
const config = require('../config');

const SettingSchema = new mongoose.Schema({
    general: {
        logo: String,
        siteTitle: {
            type: String,
            default: config.default.siteSetting.siteTitle
        },
        description: String

    },
    timeAndRegion: {
        dateFormat: {
            type: String,
            default: config.default.siteSetting.dateFormat
        },
        timeFormat: {
            type: String,
            default: config.default.siteSetting.timeFormat
        },
        timezone: {
            type: String,
            default: config.default.siteSetting.timezone
        }
    },
    session: {
        value: {
            type: Number,
            default: config.default.siteSetting.session.value
        },
        unit: {
            type: String,
            enum: ["min", "h", "d", "m", "y"],
            default: config.default.siteSetting.session.unit
        },
        defaultRoleID: {
            type: mongoose.Schema.ObjectId,
            ref: "Role"
        }
    },
    contact: {
        email: String,
        phone: String,
        address: {
            streetName: String,
            city: Number,
            state: Number,
            country: Number,
            postalCode: String
        }
    }
}, { timestamps: true, versionKey: false });

/**
 * Assign data
 * @param {Object} data 
 */
SettingSchema.methods.assignData = function (data) {
    this.general.description = data.general.description;
    this.general.siteTitle = data.general.siteTitle;
    this.timeAndRegion.dateFormat = data.timeAndRegion.dateFormat;
    this.timeAndRegion.timeFormat = data.timeAndRegion.timeFormat;
    this.timeAndRegion.timezone = data.timeAndRegion.timezone;
    this.contact.phone = data.contact.phone;
    this.contact.email = data.contact.email;
    this.contact.address = data.contact.address;
    this.session.value = data.session.value;
    this.session.unit = data.session.unit;
    this.session.defaultRoleID = data.session.defaultRoleID;
};

/**
 * Set initial settings on first installation
 * @param {Object} data 
 */
SettingSchema.methods.setInitialSetting = function (data) {
    this.general.siteTitle = data.general.siteTitle;
    this.timeAndRegion.timezone = data.timeAndRegion.timezone;
};

/**
 * Set default settings if data not provided
 */
SettingSchema.methods.default = function () {
    return {
        general: {
            siteTitle: config.default.siteSetting.siteTitle
        },
        timeAndRegion: {
            dateFormat: config.default.siteSetting.dateFormat,
            timeFormat: config.default.siteSetting.timeFormat,
            timezone: config.default.siteSetting.timezone
        },
        session: {
            value: config.default.siteSetting.session.value,
            unit: config.default.siteSetting.session.unit
        }
    }
};

SettingSchema.methods.toJSON = function () {
    return {
        general: this.general,
        timeAndRegion: this.timeAndRegion,
        session: this.session,
        contact: {
            address: this.contact.address,
            email: this.contact.email,
            phone: this.contact.phone
        }
    };
};

module.exports = mongoose.model('SiteSetting', SettingSchema, 'siteSetting');