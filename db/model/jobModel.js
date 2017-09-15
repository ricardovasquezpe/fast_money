module.exports = function(app, apiRoutes, jwt){
  var job = require('../entity/job.js');

  app.post('/api/createjob', function(req, res){
    req.check('title', 'Invalid title').notEmpty();
    req.check('description', 'Invalid description').notEmpty();
    req.check('requirements', 'Invalid requirements').notEmpty();
    req.check('location', 'Invalid location').notEmpty();
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
    req.body.location     = JSON.parse(req.body.location);
    geocoder.reverse({lat:req.body.location.x, lon:req.body.location.y})
    .then( geo => {
        req.body.location.country     = geo[0].country;
        req.body.location.city        = geo[0].city;
        req.body.location.streetName  = geo[0].streetName;
        req.body.location.countryCode = geo[0].countryCode;

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
    .catch( err => {
        res.json(
            {"status" : true,
             "data"   : 'Map error'}
          );
          return;
    })
  });

  apiRoutes.post('/api/searchjobs', function(req, res){

    
    
  });

}