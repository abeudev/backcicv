const mongoose = require('mongoose');
const Datatable = require('../libraries/datatable/Datatable');
const TableFilter = require('../libraries/datatable/Filter');
const axios = require('axios');

const config = require('../config');

const Colis = require('../models/Colis');



/**
 * Load table data using Datatable library
 * Get coliss who have same and greater role level number
 */

//  exports.table = async (req,res, next) => {
//     const table = new Datatable(req.body.datatable);
//         if(req.body.filter) {
//           const filter = new TableFilter(req.body.filter);
//           if(filter.get_match()) {
//             const custom_query = [{$match: filter.get_match()}];
//             table.set_custom_query(custom_query);
//           }
//         }
//         // const pipeline = table.generate_pipeline();



//     await Colis.find()
//     Colis.aggregate(pipeline)
//     .populate('departure_customer_ID')
//     .populate('arrival_customer_ID')
//         .then(colis => {
//             res.status(200).json({
//                 success: true,
//                 status: 200,
//                 data:  table.result(colis),
//                 message: ""
//             });
//         })
//         .catch(err => {
//             res.status(400).json({
//                 success: false,
//                 status: 400,
//                 data: err,
//                 message: err.message
//             });
//         });

// };

exports.colis = async (req, res, next) => {
    const table = new Datatable(req.body.datatable);
    


      const custom_query = [
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'departure_customer_ID',
                as: 'users'
            }
        },
        { $unwind: '$users' },
        
        { $project: { password: 0 }}
    ];
    if (req.body.filter) {
        const filter = new TableFilter(req.body.filter);
        if (filter.get_match()) {
            const custom_query = [{ $match: filter.get_match() }];
            table.set_custom_query(custom_query);
        }
    }
    
    table.set_custom_query(custom_query);
      const pipeline = table.generate_pipeline();

    Colis.aggregate(pipeline)

        .then(colis => {

            res.status(200).json({
                success: true,
                status: 200,
                data: table.result(colis),
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
// exports.table = async (req,res, next) => {
//     const table = new Datatable(req.body.datatable);
//     //let appli =    Appli();
//     //let pipeline = table.generate_pipeline();


//     await Colis.find({isActive:true})
//         .then(colis => {

//             res.status(200).json({
//                 success: true,
//                 status: 200,
//                 data: table.result(colis),
//                 message: ""
//             });
//         })
//         .catch(err => {
//             res.status(400).json({
//                 success: false,
//                 status: 400,
//                 data: err,
//                 message: err.message
//             });
//         });

// };



exports.table = (req,res, next) => {
    const table = new Datatable(req.body.datatable);
    const custom_query = [
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'departure_customer_ID',
      
                as: 'user'
            }
        },
        { $unwind: '$user' },
        {
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'arrival_customer_ID',
                as: 'users'
            }
        },
        { $unwind: '$users' },
        {
            $lookup: {
                from: 'transaction',
                foreignField: '_id',
                localField: 'transaction_ID',
                as: 'transaction'
            }
        },
        { $unwind: '$transaction' },
      

    ];
    
       
    // const custom_query1 = [
    //     {
    //         $lookup: {
    //             from: 'users',
    //             foreignField: '_id',
    //             localField: 'arrival_customer_ID',
    //             as: 'users'
    //         }
    //     },
    //     { $unwind: '$users' },

    // ];
    // const custom_query1 = [
    //     {
    //         $lookup: {
    //             from: 'transaction',
    //             foreignField: '_id',
    //             localField: 'transaction_ID',
    //             as: 'transaction'
    //         }
    //     },
    //     { $unwind: '$transaction' },

    // ];
    if(req.body.filter) {
      const filter = new TableFilter(req.body.filter);
      if(filter.get_match()) {
        custom_query.push({$match: filter.get_match()});
        // custom_query1.push({$match: filter.get_match()});
    
    }
    }
    table.set_custom_query(custom_query);
    // table.set_custom_query1(custom_query1);

    let pipeline = table.generate_pipeline();

  Colis.aggregate(pipeline)

      .then(colis => {
           console.log('Aggregate', colis[0]);
        //   Colis.departure_customer_ID.populate(colis, {path: ""}, callback);
        res.status(200).json({
            success: true,
            status: 200,
            data: table.result(colis),
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
 * Create a Colis 
 */
exports.create = async (req, res, next) => {
    const colis = new Colis();
    await colis.assignData(req.body);
    colis.isActive = true;
    colis.save()
        // .populate(colis, { path: "departure_customer_ID" })
        .then(() => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colis.toJSON(),
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
 * Update Colis
 * 
 */
exports.update = async (req, res, next) => {
    if (!req.body._id) {
        return res.status(400).json({
            success: false,
            status: 400,
            data: {},
            message: "Veuillez renseigner l'Id du colis"
        });
    }
    let sendMessage = false;

    let colis = await Colis.findById(req.body._id)
        .populate('departure_customer_ID')
        .populate('arrival_customer_ID');
    console.log('Colis', colis.transaction_status);
    console.log('Colis phone sender', colis.departure_customer_ID.phone);
    sender = colis.departure_customer_ID.phone;
    departure_customer_phone = colis.departure_customer_ID.phone;
    arrival_customer_phone = colis.arrival_customer_ID.phone;
    transaction_status = req.body.transaction_status;
    if (req.body.transaction_status) {
        req.body.transaction_status == colis.transaction_status ? sendMessage = false : sendMessage = true
        console.log('Statut resultat iciiiii', req.body.transaction_status);
    }
    Colis.findByIdAndUpdate(
        mongoose.Types.ObjectId(req.body._id),
        req.body,
        { omitUndefined: true, runValidators: true, context: 'query' })
        .then((colis) => {
            if (sendMessage) {

                console.log('message ici');
                console.log('Sender avant message ici',departure_customer_phone);
                console.log('Final avant message ici',arrival_customer_phone);
                //get user phone by id
                // let colis = await Colis.findById(req.body._id);
                // ton script d'envoi de message au client initial et final via leur contact
                const serverName = "CICV";
                const message = `http://appvas.com/script/scriptSms.php?content=Le statut de votre colis est: "${transaction_status}"&expediteur=${serverName}&destinataire=${departure_customer_phone}`;
                axios.get(message)
                .then(response => {
                  console.log(response)
                 
                })
                .catch(error => {
                  console.log(error)
                  return res.status(400).json({
                    success:false,
                    message: JSON.stringify(error)
                  });
                })
                // Arrival_customer send message

                const serverName1 = "CICV";
                const message2 = `http://appvas.com/script/scriptSms.php?content=Le statut de votre colis est:"${transaction_status}"&expediteur=${serverName1}&destinataire=${arrival_customer_phone}`;
                axios.get(message2)
                .then(response => {
                  console.log(response)
                 
                })
                .catch(error => {
                  console.log(error)
                  return res.status(400).json({
                    success:false,
                    message: JSON.stringify(error)
                  });
                })

                console.log('Message envoyé', message);
            }
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
 * Find colis by id 
 */
exports.detail_by_id = (req, res, next) => {
    Colis.findById(mongoose.Types.ObjectId(req.params.colisID))
        .then(colis => {
            res.status(200).json({
                success: true,
                status: 200,
                data: colis,
                message: "Success"
            });
        })
        .catch(err => {
            res.status(400).json({
                success: false,
                status: 400,
                data: err,
                message: 'Colis not found'
            });
        })
};

/**
 * Delete colis and record from db
 * @param {*} req 
 * @param {*} res 
 */
exports.delete_by_id = (req, res) => {
    Colis.findByIdAndDelete(
        mongoose.Types.ObjectId(req.params.colisID))
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
