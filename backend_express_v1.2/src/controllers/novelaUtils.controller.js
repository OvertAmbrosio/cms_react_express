const logger = require('../utils/logger');

const novelaUtilsCtrl = {};

const NovelaUtil = require('../models/NovelaUtil');

novelaUtilsCtrl.getNovelaUtil = async (req, res) => {
 if (req.query.method === 'getAll') {
  await NovelaUtil.find()
                  .then((data) => res.json(data))
                  .catch((err) => {
                    logger.error(err);
                    res.send('Error en el servidor')
                  })
 }
}

novelaUtilsCtrl.crearNovelaUtil = async (req, res) => {
  if (req.body.method === 'crearMapa') {
    const mapaUtil = new NovelaUtil({categorias: [], etiquetas: [], tipos: []})
    await mapaUtil.save()
                  .then(() => {
                    res.send({title: 'Guardado Con éxito Compa.!', 
                              message: 'Mapa de configuraciones creado correctamente.', 
                              status: 'success'});
                }).catch((err) => {
                  logger.error(err);
                  res.send({title: '¡Error!', 
                            message: "Codigo de Error: " + err.code, 
                            status: 'error'})
                  });
  } else if (req.body.method === 'crearCategoria') {
    const { nombre, slug, descripcion } = req.body.categorias;

    await NovelaUtil.findByIdAndUpdate({
                        _id: req.body.id_mapa}, {
                        $push: {
                          categorias: {nombre, slug, descripcion}
                        }
                      }).then((r) => {
                          res.send({title: 'Guardado Con éxito Compa.!', 
                                    message: 'Categoria creada correctamente.', 
                                    status: 'success'});
                      }).catch((err) => {
                        logger.error(err);
                        res.send({title: '¡Error!', 
                                  message: "Codigo de Error: " + err.code, 
                                  status: 'error'})
                        });
  } else if (req.body.method === 'crearTipo') {
    const { nombre, slug, descripcion } = req.body.tipos;

    await NovelaUtil.findByIdAndUpdate({
                        _id: req.body.id_mapa}, {
                        $push: {
                          tipos: {nombre, slug, descripcion}
                        }
                      }).then((r) => {
                        console.log(r);
                          res.send({title: 'Guardado Con éxito Compa.!', 
                                    message: 'Tipo creado correctamente.', 
                                    status: 'success'});
                      }).catch((err) => {
                        logger.error(err);
                        res.send({title: '¡Error!', 
                                  message: "Codigo de Error: " + err.code, 
                                  status: 'error'})
                        });
  } else if (req.body.method === 'crearEtiqueta') {
    const { text, id } = req.body.etiquetas;
    await NovelaUtil.findByIdAndUpdate({
                      _id: req.body.id_mapa}, {
                      $push: {
                        etiquetas: {text, id}
                      }
                  }).then(() => {
                      res.send({title: 'Guardado Con éxito Compa.!', 
                                message: 'Etiqueta creada correctamente.', 
                                status: 'success'});
                  }).catch((err) => {
                    logger.error(err);
                    res.send({title: '¡Error!', 
                              message: "Codigo de Error: " + err.code, 
                              status: 'error'})
                    });
  } else {
    res.send({title: '¡Error!', message: 'Metodo incorrecto papu, ¿Por dónde tratas de entrar?', status: 'error'})
  }
}

novelaUtilsCtrl.actualizarNovelaUtil = async (req, res) => {
  if (req.body.method === 'actualizarCategoria' || req.body.method === 'actualizarTipo') {
    const { tipo, data } = req.body;
    let dataActualizar = {
      [`${tipo}.$.nombre`]: data.nombre,
      [`${tipo}.$.slug`]: data.slug,
      [`${tipo}.$.descripcion`]: data.descripcion
      }
    //actualizar dependiendo si es categoria o tipo
    if (req.body.method === 'actualizarCategoria') {
      await NovelaUtil.findOneAndUpdate({'categorias._id': req.params.id },
                      { 
                        $set: dataActualizar
                      },{ 
                        new: true
                    }).then(() => {
                      res.send({title: 'Actualizado Con éxito Compa.!', 
                                message: 'Categoria actualizada correctamente.', 
                                status: 'success'});
                    }).catch((err) => {
                      logger.error(err);
                      res.send({title: '¡Error!', 
                                message: "Codigo de Error: " + err.code, 
                                status: 'error'})
                    });
    } else if (req.body.method === 'actualizarTipo'){
      await NovelaUtil.findOneAndUpdate({'tipos._id': req.params.id },
                      { 
                        $set: dataActualizar
                      },{ 
                        new: true
                    }).then(() => {
                      res.send({title: 'Actualizado Con éxito Compa.!', 
                                message: 'Tipo actualizado correctamente.', 
                                status: 'success'});
                    }).catch((err) => {
                      logger.error(err);
                      res.send({title: '¡Error!', 
                                message: "Codigo de Error: " + err.code, 
                                status: 'error'})
                    });
    }
  } else if (req.body.method === 'actualizarEtiquetas' ) {
    const { data } = req.body;
    await NovelaUtil.findOneAndUpdate({'etiquetas._id': req.params.id },
                    { 
                      $set: {
                        'etiquetas.$.text': data.text,
                        'etiquetas.$.id': data.id
                      }
                    },{ 
                      new: true
                  }).then(() => {
                    res.send({title: 'Actualizado Con éxito Compa.!', 
                              message: 'Etiqueta actualizada correctamente.', 
                              status: 'success'});
                  }).catch((err) => {
                    logger.error(err);
                    res.send({title: '¡Error!', 
                              message: "Codigo de Error: " + err.code, 
                              status: 'error'})
                  });
  } else {
    res.send({title: '¡Error!', message: 'Metodo incorrecto papu, ¿Por dónde tratas de entrar?', status: 'error'})
  }
}

novelaUtilsCtrl.borrarNovelaUtil = async (req, res) => {
  if (req.body.method === 'borrarCategoria' || req.body.method === 'borrarTipo') {
    //borrar dependiendo si es categoria o tipo
    if (req.body.method === 'borrarCategoria') {
      await NovelaUtil.updateOne({'categorias._id': { _id: req.params.id }},
                        { $pull: { categorias: { _id: req.params.id } } },
                        { multi: false 
                    }).then(() => {
                      res.send({title: 'Eliminado Con éxito Compa.!', 
                                message: 'Categoria eliminada correctamente.', 
                                status: 'success'});
                    }).catch((err) => {
                      logger.error(err);
                      res.send({title: '¡Error!', 
                                message: "Codigo de Error: " + err.code, 
                                status: 'error'})
                    });
    } else if (req.body.method === 'borrarTipo'){
      await NovelaUtil.updateOne({'tipos._id': { _id: req.params.id }},
                      { $pull: { tipos: { _id: req.params.id } } },
                      { multi: false 
                    }).then(() => {
                      res.send({title: 'Borrado Con éxito Compa.!', 
                                message: 'Tipo borrado correctamente.', 
                                status: 'success'});
                    }).catch((err) => {
                      logger.error(err);
                      res.send({title: '¡Error!', 
                                message: "Codigo de Error: " + err.code, 
                                status: 'error'})
                    });
    }
  } else if (req.body.method === 'borrarEtiqueta' ) {
    await NovelaUtil.updateOne({ 'etiquetas._id': { _id: req.params.id } },
                      { $pull: { etiquetas: { _id: req.params.id } } },
                      { multi: false 
                  }).then(() => {
                    res.send({title: 'Eliminado Con éxito Compa.!', 
                              message: 'Etiqueta eliminada correctamente.', 
                              status: 'success'});
                  }).catch((err) => {
                    logger.error(err);
                    res.send({title: '¡Error!', 
                              message: "Codigo de Error: " + err.code, 
                              status: 'error'})
                  });
  } else if (req.body.methood === 'borrarMapa') {
    await NovelaUtil.findByIdAndDelete(req.params.id)
                    .then(() => {
                      res.send({title: '¡Categorias, Tipos y Etiquetas Eliminados!', 
                                status: 'success', 
                                message: 'Mapa eliminado exitosamente',
                                dataMessages: dataMessages});
                    }).catch((error) => {
                        logger.error(error);
                        res.send({title: '¡Error en el servidor!', 
                                  status: 'error',
                                  message: 'Aun sigue ahi compa.'});
                    });
  } else {
    logger.info(JSON.stringify(req.body));
    res.send({title: '¡Error!', message: 'Metodo incorrecto papu, ¿Por dónde tratas de entrar?', status: 'error'})
  }
}

module.exports = novelaUtilsCtrl;