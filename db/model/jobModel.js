module.exports = function(app, jwt){
  var job      = require('../entity/job.js');
  var favorite = require('../entity/favorite.js');
  var bid      = require('../entity/bid.js');

  app.post('/api/createjob', function(req, res){
    req.check('title', 'Invalid title').notEmpty();
    req.check('description', 'Invalid description').notEmpty();
    req.check('requirements', 'Invalid requirements').notEmpty();
    req.check('location_geo', 'Invalid location').notEmpty();
    req.check('payment', 'Invalid payment').notEmpty();

    if(req.body.expiration_at.trim() == ""){
      exp_date = new Date();
      exp_date.setDate(exp_date.getDate() + 20);
      req.body.expiration_at = exp_date;
    }else{
      req.check('expiration_at', 'Invalid dateformat expiration_at').isDate();
    }
    
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    var geocoder = require('../../plugins/geocoder.js');
    req.body.location_geo = JSON.parse(req.body.location_geo);
    geocoder.reverse({lat:req.body.location_geo[0], lon:req.body.location_geo[1]})
    .then( geo => {
        var location = {country:geo[0].country, city:geo[0].city, streetName:geo[0].streetName, countryCode:geo[0].countryCode};
        req.body.location = location;
        req.body.created_at = new Date();
        req.body.requirements = JSON.parse(req.body.requirements);
        req.body.payment      = JSON.parse(req.body.payment);
        req.body.id_company   = req.decoded._doc._id;
        var newJob = job(req.body);
        newJob.save(function(err) {
          if (err){
            res.json(
                  {"status" : false,
                   "data"   : "Weird error"}
                );
            return;
          }

          res.json(
            {"status" : true,
             "data"   : 'Job created!'}
          );
          return;

        });
    })
    .catch( error_map => {
      console.log(error_map);
        res.json(
            {"status" : false,
             "data"   : error_map}
          );
          return;
    })
  });

  app.post('/api/searchjobs', function(req, res){
    req.check('position', 'Invalid position').notEmpty();
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    limit       = req.body.limit || 10;
    maxDistance = req.body.distance || 5;
    maxDistance /= 6371;
    req.body.position = JSON.parse(req.body.position);

    job.find({  
        location_geo: {
            $near: req.body.position,
            $maxDistance: maxDistance
        }
    }, { '_id': 1, 'title' : 1, 'location_geo': 1}).limit(limit).exec(function(err, locations) {
        if (err) {
            res.json(
              {"status" : false,
               "data"   : err}
            );
            return;
        }

        res.json(
          {"status" : true,
           "data"   : locations}
        );
        return;
    });
    
  });

  app.post('/api/jobdetails', function(req, res){
    req.check('id_job', 'Invalid id_job').notEmpty();
    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    job.findById(req.body.id_job, { '__v': 0 }, function (err, job) { 
      if(!job){
        res.json(
          {"status" : false,
           "data"   : 'Job not found'}
        );
        return;
      }

      job = job.toObject();
      favorite.find({ id_user : req.decoded._doc._id, id_job : req.body.id_job }, { '_id' : 1 }, function(err, favorite) {
          job.id_favorite = "";
          if (favorite.length){
              job.id_favorite = favorite[0]._id;
          }

          bid.find({ id_user : req.decoded._doc._id, id_job : req.body.id_job }, { '_id' : 1 }, function(err, bid) {
            job.id_bid = "";
            if (bid.length){
                job.id_bid = bid[0]._id;
            }

            res.json(
              {"status" : true,
               "data"   : job}
          );
          return;

          });
      });
    });
  });

  app.post('/api/myjobs', function(req, res){
    job.find({ id_company : req.decoded._doc._id }, { '_id' : 1, 'title' : 1, 'location' : 1 }, function(err, jobs) {
        if (!jobs){
            res.json(
              {"status" : false,
               "data"   : "Jobs not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : jobs}
        );
      return;
    });
  });

  /*app.post('/api/alljobs', function(req, res){
    lastdate = (req.body.lastdate.length == 0) ? new Date() : req.body.lastdate;

    job.find({ created_at : {"$lt": lastdate} }, { '_id' : 1, 'title' : 1, 'description' : 1, 'payment' : 1, 'location' : 1, 'created_at' : 1 }).sort({created_at: -1}).limit(10).exec(function(err, jobs) { 

        if (!jobs){
            res.json(
              {"status" : false,
               "data"   : "Jobs not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : jobs}
        );
      return;
     });
  });*/

  app.post('/api/filterjobs', function(req, res){
    lastdate = (req.body.lastdate.length == 0) ? new Date() : req.body.lastdate;

    job.find({ created_at : {"$lt": lastdate} , title : { $regex: '.*' + req.body.description + '.*', $options: "i" }, "payment.type" : { $regex: '.*' + req.body.type + '.*'}, 
               "location.country" : { $regex: '.*' + req.body.country + '.*', $options: "i"}/*,
               "payment.amount" : { $gt: req.body.description, $lt: req.body.description }*/}, { '_id' : 1, 'title' : 1, 'description' : 1, 'created_at' : 1 }).sort({created_at: -1}).limit(10).exec(function(err, jobs) { 

        if (!jobs){
            res.json(
              {"status" : false,
               "data"   : "Jobs not found"}
            );
          return;
        }

        res.json(
          {"status" : true,
           "data"   : jobs}
        );
      return;
     });
  });

}