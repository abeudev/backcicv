const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');

const config = require('../config');

const Warehouse = require('../models/Warehouse');

/**
 * Load table data using Datatable library
 */
 exports.table = (req, res, next) => {
  const table = new Datatable(req.body.datatable);
  if(req.body.filter) {
    const filter = new TableFilter(req.body.filter);
    if(filter.get_match()) {
      const custom_query = [{$match: filter.get_match()}];
      table.set_custom_query(custom_query);
    }
  }
  const pipeline = table.generate_pipeline();
  
  Warehouse.aggregate(pipeline)
    .then(warehouse => {
      res.status(200).json({
          success: true,
          status: 200,
          data: table.result(warehouse),
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
 * Create a Warehouse 
 */
exports.create = async (req, res, next) => {
    const warehouse = new Warehouse();
    await warehouse.assignData(req.body);
    warehouse.isActive = true;
    warehouse.save()
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: warehouse.toJSON(),
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
 * Update Warehouse
 * 
 */
exports.update = (req, res, next) => {
    Warehouse.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((warehouse) => {
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
 * Find warehouse by id 
 */
exports.detail_by_id = (req, res, next) => {
    Warehouse.findById(mongoose.Types.ObjectId(req.params.warehouseID))
        .then(warehouse => {
            res.status(200).json({
                success: true,
                status: 200,
                data: warehouse,
                message: "Success"
            });
        })
        .catch(err =>{
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Warehouse not found'
            });
        })
};

/**
 * Delete warehouse and record from db
 * @param {*} req 
 * @param {*} res 
 */
 exports.delete_by_id = (req, res) => {
    Warehouse.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.warehouseID))
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
 * Load warehouses as options for selection purphose
 */
 exports.options = (req, res) => {
    Warehouse.find({isActive : true})
      .then(warehouses => {
        warehouses = warehouses.map(warehouse => {
          return {
            text : warehouse.name,
            value : warehouse._id
          }
        });
        res.status(200).json({
            success: true,
            status: 200,
            data: warehouses,
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
   * Find all saved tags
   */
  exports.find_all_tags = (req, res) => {
    Warehouse.find({isActive : true})
      .then(warehouses => {
        const tags = [];
        warehouses.forEach(warehouse => {
          warehouse.tags.forEach(tag => {
            if(!isTagPresent(tag, tags)) {
              tags.push(tag);
            }
          });
        });
        res.status(200).json({
            success: true,
            status: 200,
            data: tags,
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
   * Convert base64 to image file and save to public dir
   */
  const uploadImage = (image, prefix = 'image') => {
    const destination_path = appDir + config.upload.images;
    const file_name = `${prefix}-${Date.now()}`;
    try {
      if (image) {
        const isUrlImg = image.substr(0, 4) == 'http';
        if(isUrlImg) return image;
        const filepath = base64img.imgSync(image, destination_path, file_name,);
        return filepath.replace(appDir + '/public', config.server)
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  
  /**
   * Check if tag already in list
   */
  const isTagPresent = (tag, tags) => {
    return tags.includes(tag)
  }