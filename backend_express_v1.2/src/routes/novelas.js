const { Router } = require('express');
const router = Router();

const { buscarNovelas ,getNovelas, crearNovela, getNovela, actualizarNovela, borrarNovela } = require('../controllers/novelas.controller');
const { getNovelaTipo, crearNovelaTipo, actualizarNovelaTipo, borrarNovelaTipo } = require('../controllers/novelasTipo.controller');
const { getNovelaCate, crearNovelaCate, actualizarNovelaCate, borrarNovelaCate } = require('../controllers/novelasCate.controller');
const { getEtiqueta, crearEtiqueta, actualizarEtiqueta, borrarEtiqueta } = require('../controllers/novelasTags.controller');

router.route('/')
      .get(getNovelas)
      .post(crearNovela);

router.route('/buscar/:id')
      .get(getNovela)
      .put(actualizarNovela)//actualizar todo el objeto
      .delete(borrarNovela);
//         // .patch()//actualizar un dato del objeto
router.route('/busqueda/:var')
      .get(buscarNovelas);
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

      
//Etiquetas de Novelas
router.route('/etiquetas')
.get(getEtiqueta)
.post(crearEtiqueta);

router.route('/etiquetas/buscar/:id')
.put(actualizarEtiqueta)
.delete(borrarEtiqueta);

module.exports = router