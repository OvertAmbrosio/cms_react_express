const express = require('express');
const router = express.Router();
// Cargar controlador
const { getUsers, actualizarUser, borrarUser, registro, login} = require('../controllers/users.controller');

router.route('/').get(getUsers);

router.route('/:id')
      .patch(actualizarUser)
      .delete(borrarUser);

router.route('/register').post(registro);

router.route('/login').post(login);

 module.exports = router;