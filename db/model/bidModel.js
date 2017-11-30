module.exports = function(app, jwt){
  var bid = require('../entity/bid.js');

  app.post('/api/createbid', function(req, res){
  	req.check('id_job', 'Invalid id_job').notEmpty();
    req.check('comment', 'Invalid comment').notEmpty();

    var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    req.body.created_at = new Date();
    req.body.status     = "created";
    req.body.id_user    = req.decoded._doc._id;
    var newBid = bid(req.body);
    newBid.save(function(err) {
      if (err){
        res.json(
              {"status" : false,
               "data"   : "Weird error"}
            );
        return;
      }

      res.json(
        {"status" : true,
         "data"   : 'Bid created!'}
      );
      return;

    });

  });

  app.post('/api/acceptbid', function(req, res){
  	req.check('id_bid', 'Invalid id_bid').notEmpty();
  	var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

    var acceptBid = {
	    status     : "accepted",
	    updated_at : new Date()
	  };
	  bid.findByIdAndUpdate(req.body.id_bid, acceptBid, function(err, bidFound) {
        if(!bidFound){
            res.json(
              {"status" : false,
               "data"   : "Bid not found"}
            );
        	return;
        }

        var rejectBid = {
		    status     : "rejected",
		    updated_at : new Date()
		};

        bid.update({ id_job : bidFound.id_job, _id: {'$ne' : bidFound._id } }, rejectBid, { "multi" : true }, function(err, numberAffected, rawResponse) {
		   res.json(
		        {"status" : true,
		         "data"   : 'Bid accepted!'}
		      );
		    return;
		}) 
    });
  });

  app.post('/api/bidsjob', function(req, res){
  	req.check('id_job', 'Invalid id_job').notEmpty();
  	var error = req.validationErrors();
    if(error){
      res.json(
        {"status" : false,
         "data"   : error}
      );
      return;
    }

  	bid.find({ id_job : req.body.id_job }, { '__v' : 0, 'id_job' : 0 },function(err, bids) {
        if (!bids){
            res.json(
              {"status" : false,
               "data"   : "Bids not found"}
            );
        	return;
        }

        res.json(
	        {"status" : true,
	         "data"   : bids}
	      );
	    return;
    });
  });

}