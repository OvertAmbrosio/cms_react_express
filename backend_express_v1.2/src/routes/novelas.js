const { Router } = require('express');
const router = Router();

const { 
  buscarNovelas , getNovelas, getNovelasEmision, crearNovela, getNovela, actualizarNovela, borrarNovela 
} = require('../controllers/novelas.controller');

const { 
  getNovelaUtil, crearNovelaUtil, actualizarNovelaUtil, borrarNovelaUtil 
} = require('../controllers/novelaUtils.controller');


router.route('/emision')
      .get(getNovelasEmision);

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

//Novela Utils (categoria, tipo, etiquetas)
router.route('/utils')
      .get(getNovelaUtil)
      .post(crearNovelaUtil);
      
router.route('/utils/buscar/:id')
      .put(actualizarNovelaUtil)
      .delete(borrarNovelaUtil);

module.exports = router