// BASE SETUP
//-----------------------------------
// CALL PACKAGES ----------------------------

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

var User = require('./app/models/user');

//connect to out database

mongoose.connect('mongodb://localhost:27017/test_db');

//APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//config our app to handle CORS requests
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Method', 'GET-POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    next();
});

//log all request to the console
app.use(morgan('dev'));

//ROUTES FOR YOUR API
//-----------------------------------------------

// basics route for the home PACKAGES

app.get('/', function(req, res) {
    res.send('Welcome to the home page');
});

// get an instance of the express router
var apiRouter = express.Router();
// test route to make sure evrethig is working
// access tp get http://localhost:8080/apiRouter
apiRouter.get('/', function(req, res) {
    res.json({message: 'Yeah Baby... welcome to our api'});
});
// access tp get http//localhost:8080/api
apiRouter.use(function(req, res, next) {
    // do logging
    console.log('il y a quelquun sur mon api');
    next();
});


app.use('/api', apiRouter);

apiRouter.route('/users')
.post(function(req, res) {
    var user = new User();

    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function(err) {
        if (err) {
            if (err.code == 11000)
                return res.json({success: false, message: "l'utilisateur existe déja."});
            else
                return res.send(err);
            }
        res.json({message: "Lutilissateur est dans la palce"});

    });
})

.get(function(req,res){
  User.find(function(err, users){
    if (err) res.send(err);
    //return the users
    res.json(users);
  });
});

//GET On :USER_ID
apiRouter.route('/users/:user_id')
.get (function(req, res){
  User.findById(req.params.user_id, function(err, user){
    if (err) res.send(err);
    // return that user
    res.json(user);
  });
})

.put(function(req, res){
  User.findById(req.params.user_id, function(err, user){
if (req.body.name) user.name = req.body.name;
if(req.body.username)  user.username = req.body.username;
if(req.body.password) user.password = req.body.password;

//save the user

user.save(function(err){
  if(err) res.send(err);
  //return a message
  res.json({message: "Uitilisatuer mis a jour!"});
});
});
})
.delete(function(req, res){
  User.remove({
    _id:req.params.user_id
  }, function(err, user){
    if (err) return res.send(err);
    res.json({message: 'Supprimer avec succes'})
  });
});


// Start the server

app.listen(port);
console.log('La magie sur le port ' + port);
