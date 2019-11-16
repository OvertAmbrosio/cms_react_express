const { Router } = require('express');
const router = Router();


const { 
  getImagenes,
  subirImagen,
  getImagensXNovelas,
  borrarImagen
 } = require('../controllers/imagenes.controller');

router.route('/')
      .get(getImagenes)
      .post(subirImagen);

router.route('/listar/:id')
      .get(getImagensXNovelas)
      .delete(borrarImagen);

module.exports = router