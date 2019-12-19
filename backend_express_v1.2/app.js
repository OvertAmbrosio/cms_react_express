const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const cors = require('cors');
const multer = require('multer');

const serveStatic = require('serve-static')

const path = require('path');

//rutas apis
const users = require("./src/routes/users");
const novelas = require("./src/routes/novelas");
const capitulos = require("./src/routes/capitulos");
const imagenes = require("./src/routes/imagenes");

//inicializaciones
const app = express();
//definir PATHS staticas:
const url_base = path.join(__dirname, 'public');
const cmsTNO = path.join(__dirname, 'public/TNO');

// //settings
app.set('port', process.env.PORT || 4000);
app.use(compression());
// //inicializar paths
app.use('/', serveStatic(url_base));
app.use('/cms/*', serveStatic(cmsTNO));
//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
const storage = multer.diskStorage({
    destination: path.join(__dirname, '/public/img/uploads'),
    filename: (req, file, cb) =>{
        cb(null, "image_" + file.originalname); 
    }
});
app.use(multer({storage}).single('imagen'));
app.use(cors());
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({url: process.env.MONGODB_URI, ttl: 2 * 24 * 60 * 60}),
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
app.use('/api/imagenes', imagenes);
app.use('/api/capitulos', capitulos);
app.use('/api/novelas', novelas);
app.use('/api/users', users); //usuarios dentro del cms



module.exports = app;