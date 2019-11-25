const { Router } = require('express');
const router = Router();


const { 
  getImagenes,
  getImagen,
  subirImagen,
  actualizarImagen,
  getImagensXNovelas,
  borrarImagen
 } = require('../controllers/imagenes.controller');

router.route('/')
      .get(getImagenes)
      .post(subirImagen);

router.route('/listar/:id')
      .get(getImagensXNovelas)
      .put(actualizarImagen)
      .delete(borrarImagen);

router.route('/buscar/:id')
      .get(getImagen);

module.exports = router