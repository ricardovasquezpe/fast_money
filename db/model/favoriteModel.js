module.exports = function(app, jwt){
  var favorite = require('../entity/favorite.js');

  app.post('/api/createfavorite', function(req, res){
  	req.check('id_job', 'Invalid id_job').notEmpty();

    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    req.body.created_at = new Date();
    req.body.id_user    = req.decoded._doc._id;
    var newFavorite = favorite(req.body);
    newFavorite.save(function(err) {
      if (err){
        res.json(
              {"status" : false,
               "data"   : "Weird error"}
            );
        return;
      }

      res.json(
        {"status" : true,
         "data"   : 'Favorite created!'}
      );
      return;

    });

  });

  app.post('/api/removefavorite', function(req, res){
    req.check('id_favorite', 'Invalid id_favorite').notEmpty();

    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    favorite.remove({ _id: req.body.id_favorite }, function(err) {
        if (err) {
            res.json(
              {"status" : false,
               "data"   : "Weird error"}
            );
            return;
        }
        res.json(
          {"status" : true,
           "data"   : 'Favorite removed!'}
        );
        return;
    });

  });


  app.post('/api/myfavorites', function(req, res){
  	favorite.find({ id_user : req.decoded._doc._id }, { '_id' : 1, 'title' : 1, 'location' : 1 }, function(err, jobs) {
        if (!jobs){
            res.json(
              {"status" : false,
               "data"   : "Favorites not found"}
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