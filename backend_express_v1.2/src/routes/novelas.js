const { Router } = require('express');
const router = Router();

const { getNovelas, crearNovela, getNovela, actualizarNovela, borrarNovela } = require('../controllers/novelas.controller');

router.route('/')
      .get(getNovelas)
      .post(crearNovela);

router.route('/:id')
      .get(getNovela)
      .put(actualizarNovela)//actualizar todo el objeto
      .delete(borrarNovela)
//         // .patch()//actualizar un dato del objeto

module.exports = router