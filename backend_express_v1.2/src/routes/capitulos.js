const { Router } = require('express');
const router = Router();

const { getCapitulos, crearCapitulo, getCapitulo, actualizarCapitulo, borrarCapitulo, getCapitulosXNovelas, BusquedaXNumero } = require('../controllers/capitulos.controller');

router.route('/')
      .get(getCapitulos)
      .post(crearCapitulo);

router.route('/buscar/:id')
      .get(getCapitulo)
      .put(actualizarCapitulo)//actualizar todo el objeto
      .delete(borrarCapitulo);
//         // .patch()//actualizar un dato del objeto
router.route('/listar/:id')
      .get(getCapitulosXNovelas);
//buscar capitulo por numero de cap o usuario
router.route('/busqueda')
      .get(BusquedaXNumero);

module.exports = router