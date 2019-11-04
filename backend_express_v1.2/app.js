const express = require('express');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const multer = require('multer');

const path = require('path');

//rutas apis
const users = require("./src/routes/users");
const novelas = require("./src/routes/novelas");
const capitulos = require("./src/routes/capitulos");

//inicializaciones
const app = express();

// //settings
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 4000);

app.route('/').get(function(req, res) { 
    return res.sendFile(path.join(__dirname, '/public/index.html')); 
});

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, '/public/img/uploads'),
    filename: (req, file, cb) =>{
        cb(null, "image_" + file.originalname); 
    }
});
app.use(multer({storage}).fields([
    { 
      name: 'portada', 
      maxCount: 1 
    }, 
    { 
      name: 'mini', 
      maxCount: 1 
    }
  ]));
app.use(cors());
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    app.locals.signupMessage = req.flash('signupMessage');
    app.locals.signinMessage = req.flash('signinMessage');
    app.locals.user = req.user;
    next();
});

// Passport middleware
app.use(passport.initialize());

//Routes
app.use('/api/capitulos', capitulos);
app.use('/api/novelas', novelas);
app.use('/api/users', users); //usuarios dentro del cms



module.exports = app;