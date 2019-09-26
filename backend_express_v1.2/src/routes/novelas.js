const { Router } = require('express');
const router = Router();

const { getNovelas, crearNovela, getNovela, actualizarNovela, borrarNovela } = require('../controllers/novelas.controller');
const { getNovelaTipo, crearNovelaTipo, actualizarNovelaTipo, borrarNovelaTipo } = require('../controllers/novelasTipo.controller');
const { getNovelaCate, crearNovelaCate, actualizarNovelaCate, borrarNovelaCate } = require('../controllers/novelasCate.controller');

router.route('/')
      .get(getNovelas)
      .post(crearNovela);

router.route('/buscar/:id')
      .get(getNovela)
      .put(actualizarNovela)//actualizar todo el objeto
      .delete(borrarNovela);
//         // .patch()//actualizar un dato del objeto

//Tipo de Novelas
router.route('/tipo')
      .get(getNovelaTipo)
      .post(crearNovelaTipo);

router.route('/tipo/buscar/:id')
      .put(actualizarNovelaTipo)
      .delete(borrarNovelaTipo);

module.exports = router

//Categoria de Novelas
router.route('/categoria')
      .get(getNovelaCate)
      .post(crearNovelaCate);

router.route('/categoria/buscar/:id')
      .put(actualizarNovelaCate)
      .delete(borrarNovelaCate);

module.exports = router