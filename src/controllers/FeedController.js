const mongoose = require('mongoose');
const base64img = require("base64-img");
const appDir = require('path').dirname(require.main.filename);
const config = require('../config');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');
const Feed = require('../models/Feed');

/**
 * Create Feed.
 * Convert base64 to image file then save.
 */
exports.create = (req, res) => {
    const feed = new Feed();
    const image = uploadImage(req.body.image, 'feed');
    if (image) req.body.image = image;
    feed.assignData(req.body);
    feed.save()
      .then(saved_feed => {
        res.status(200).json({
            success: true,
            status: 200,
            data: saved_feed,
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
    
    Feed.aggregate(pipeline)
      .then(feed => {
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(feed),
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
 * View detail by id
 */
exports.detail_by_id = (req, res) => {
  Feed.findById(mongoose.Types.ObjectId(req.params.feedID))
    .then((feed) => {
      res.status(200).json({
          success: true,
          status: 200,
          data: feed.toJSON(),
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
 * Update feed.
 * Convert base64 to image file then save.
 */
exports.update = (req, res) => {
  const image = uploadImage(req.body.image, 'feed');
  if (image) req.body.image = image;
  Feed.findByIdAndUpdate(
    mongoose.Types.ObjectId(req.body._id),
    req.body,
    { omitUndefined :true,  runValidators: true, context: 'query' })
    .then(feed => {
      res.status(204).json({
          success: true,
          status: 204,
          data: feed.toJSON(),
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
 * Load feeds as options for selection purphose
 */
exports.options = (req, res) => {
  Feed.find({isActive : true})
    .then(feeds => {
      feeds = feeds.map(feed => {
        return {
          text : feed.name,
          value : feed._id
        }
      });
      res.status(200).json({
          success: true,
          status: 200,
          data: feeds,
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
  Feed.find({isActive : true})
    .then(feeds => {
      const tags = [];
      feeds.forEach(feed => {
        feed.tags.forEach(tag => {
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
