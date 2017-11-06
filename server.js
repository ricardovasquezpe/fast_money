//LIBRARIES
var express          = require('express');
var bodyParser       = require('body-parser');
var mongoose         = require('mongoose');
var expressValidator = require('express-validator');
var jwt              = require('jsonwebtoken');
var app              = express();
var apiRoutes        = express.Router(); 
mongoose.connect("mongodb://admin:123@ds143990.mlab.com:43990/fastmoney");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.set('superSecret', '1029384756');

//VALIDATE TOKEN
apiRoutes.use(function(req, res, next) {
  var token = req.headers['x-access-token'];
  if (token) {
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {      
      if (err) {
        res.json(
              {"status" : false,
               "data"   : 'Failed to authenticate token' }
            );
        return;    
      }else{
        req.decoded = decoded;    
        next();
      }
    });
  }else{
    res.json(
          {"status" : false,
           "data"   : 'No token provided' }
        );
    return;
  }
});

//MODELS
require('./db/model/userModel.js')(app, apiRoutes, jwt);

//INIT
app.use('/api', apiRoutes);

//MODELS
require('./db/model/jobModel.js')(app, jwt);
require('./db/model/bidModel.js')(app, jwt);
require('./db/model/favoriteModel.js')(app, jwt);

var port = process.env.PORT || 8000;
app.listen(port);
console.log("Fast money API");