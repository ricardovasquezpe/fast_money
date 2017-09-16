module.exports = function(app, jwt){
  var job = require('../entity/job.js');

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
    geocoder.reverse({lat:-12.0778003, lon:-76.9596523})
    .then( geo => {
        var location = {country:geo[0].country, city:geo[0].city, streetName:geo[0].streetName, countryCode:geo[0].countryCode};
        req.body.location = location;
        req.body.created_at = new Date();
        req.body.requirements = JSON.parse(req.body.requirements);
        req.body.payment      = JSON.parse(req.body.payment);
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

    job.findById(req.body.id_job, { '__v': 0, 'location_geo': 0 }, function (err, job) { 
      if(!job){
        res.json(
          {"status" : false,
           "data"   : 'Job not found'}
        );
        return;
      }
      res.json(
          {"status" : true,
           "data"   : job}
      );
      return;
    });

  });

}