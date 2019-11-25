//usuarios del cms
const usersCtrl = {};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const keys = process.env.secretOrKey;

// Load input validation
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");

const User = require('../models/User');

// @route POST api/users/register
// @desc Register user
// @access Public
usersCtrl.registro = (req, res) => {
  // Form validation
const { errors, isValid } = validateRegisterInput(req.body);
  //Check codigo deregistro
  if(req.body.codigo != process.env.registerKey){
    return res.status(400).json({codigo: "Consigue el Codigo de Registro Papu"});
  }
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "El correo ya existe" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
};

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
usersCtrl.login = (req, res) => {
  // Form validation
  const { errors, isValid } = validateLoginInput(req.body);
  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  // Find user by email
  User.findOne({ email }).then(user => {
    // Check if user exists
    if (!user) {
      return res.status(404).json({ emailnotfound: "Correo no encontrado" });
    } else if (user.state == false) {
      return res.status(404).json({ userstate: "Usuario inactivo" });
    }
    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // User matched
        // Create JWT Payload
        const payload = {
          id: user.id,
          name: user.name
        };
        // Sign token
        jwt.sign(
          payload,
          keys,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Contraseña incorrecta" });
      }
    });
  });
};

usersCtrl.getUsers = (req, res, next) => {
  const users = User.find({}).select({ "name": 1, "email": 1, "state": 1, "updatedAt": 1});

  users.exec(function (err, user) {
    if (err) return next(err);
    res.send(user); 
  });
}

usersCtrl.actualizarUser = (req, res) => {
  let value = Boolean;
  if (req.body.op === "updateState") {
    value = req.body.value;
    const users = User.updateOne({_id: req.params.id}, { $set: {state: value} });
    users.exec(function(err, user) {
      if (err) {
        console.log(err);
        res.send({
          title: '¡Hubo un error en el servidor!', 
          message: err.errors, 
          status: 'error'
        });
      } else {
        console.log(user);
        res.send({
          title: '¡Actualizado con éxito!', 
          message: "todo bien", 
          status: 'success'
        });
      }
    })
  } else if (req.body.op == "updateUser"){
    let obj = req.body.value;
    console.log(obj);
    
    const users = User.updateOne({_id: req.params.id}, { $set: {name: obj.name, email: obj.email} });

    users.exec(function(err) {
      if (err) {
        console.log(err);
        res.send({
          title: '¡Hubo un error en el servidor!', 
          message: err.errors, 
          status: 'error'
        });
      } else {
        res.send({
          title: '¡Actualizado con éxito!', 
          message: 'Usuario actualizado correctamente compa.', 
          status: 'success'
        });
      }
    })
  }

}

usersCtrl.borrarUser = (req, res) => {
  if (req.body.op === 'deleteUser') {
    const users = User.findByIdAndDelete(req.params.id);
    users.exec(function (err, user) {
      if (err) {
        console.log(err)
        res.send({
          title: '¡Error al borrar!', 
          message: err.errors, 
          status: 'error'
        });
      } else {
        console.log(user)
        res.send({
          title: 'Borrado con éxito!', 
          message: 'Usuario borrado correctamente compa.', 
          status: 'success'
        });
      }
    });
  } else {
    res.send({
      title: 'Nel papu', 
      message: 'Intentas acceder por medios no oficiales.', 
      status: 'success'
    });
  }
}

module.exports = usersCtrl;