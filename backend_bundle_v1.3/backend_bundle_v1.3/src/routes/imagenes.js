const { Router } = require('express');
const router = Router();


const { 
  getImagenes,
  subirImagen,
  getImagensXNovelas
 } = require('../controllers/imagenes.controller');

router.route('/')
      .get(getImagenes)
      .post(subirImagen);
// router.route('/buscar/:id')
// .get(getCapitulo)
// .put(actualizarCapitulo)//actualizar todo el objeto
// .delete(borrarCapitulo)
// .patch(ActualizarEstado);//actualizar un dato del objeto

router.route('/listar/:id')
      .get(getImagensXNovelas);
// //buscar capitulo por numero de cap o usuario
// router.route('/busqueda')
// .get(BusquedaXNumero);

module.exports = router