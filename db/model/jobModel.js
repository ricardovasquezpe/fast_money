module.exports = function(app, apiRoutes, jwt, User){
  var User = require('../entity/job.js');

  apiRoutes.post('/api/getJobsNearly', function(req, res){
    req.check('coord_x', 'Invalid Coord X').notEmpty();
    req.check('coord_y', 'Invalid Coord Y').notEmpty();
    
  });
}