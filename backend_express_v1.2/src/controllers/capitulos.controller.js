const capituloCtrl = {};
const logger = require('../utils/logger');

const Novela = require('../models/Novela');
const Contenido = require('../models/CapituloContenido');

capituloCtrl.getCapitulos = async (req, res) => {
  await Novela.find()
              .populate({
                path:'capitulos.contenido',
                match: { tipo: { $gte: 'primario' } },
                select: 'traductor.nombre'
            }).select({
              capitulos: 1, titulo: 1
            }).sort({updatedAt:-1})
              .exec(function (err, docs) {
                if (err){
                  logger.error(err)
                  res.send({message: "Error en el servidor."})
                }
                res.send(docs)
              });
}

capituloCtrl.crearCapitulo = async (req, res) => {
  const { id_novela,
          titulo,
          numero,
          estado,
          slug,
          contenido,
          tipo,
          traductor,
          nota} = req.body.data;
  
    let nuevoContenido = new Contenido({contenido, tipo, traductor, nota});

  if (req.body.method == 'crearCapitulo') {
    //guardar el contenido
    await nuevoContenido.save()
                        .then(async (doc) => {
                          //guardar el capitulo en la novela
                          let id_contenido = doc._id
                          await Novela.findByIdAndUpdate({
                                      _id: id_novela}, {
                                      $push: {
                                        capitulos: {
                                          $each: [ {titulo, numero, estado, slug, contenido: id_contenido}],
                                          $sort: {numero: -1}
                                        }
                                      }
                                    }).then(() => {
                                        res.send({title: 'Guardado Con éxito Compa.!', 
                                                  message: 'Capitulo creado correctamente.', 
                                                  status: 'success'});
                                    }).catch((err) => {
                                      logger.error(err);
                                      res.send({title: '¡Error!', 
                                                message: "Codigo de Error: " + err.code, 
                                                status: 'error'})
                                      });
                      }).catch((err) => {
                        logger.error(err);
                        res.send({
                          title: '¡Error al guardar el contenido!', 
                          message: err._message, 
                          status: 'error'
                        });
                      })
    
  } else {
    res.send('Por aqui no se hace eso papu')
  }
}

capituloCtrl.getCapitulo = async (req, res) => {
  await Novela.findOne({
              'capitulos._id': req.query.id_cap}, {'capitulos.$': 1
            }).populate({
              path:'capitulos.contenido',
              match: { tipo: { $gte: 'principal' } }
            }).select({
              _id: 0
            }).then((capitulo) => {
                res.send(capitulo);
              }).catch((err) => {
                logger.error(err);
                res.send("Error en el servidor")
              });
}

capituloCtrl.actualizarCapitulo = async (req, res) => {
  const { id_contenido, titulo, numero, slug, estado, contenido, nota } = req.body.data;
  console.log(req.param)
  if (req.body.method == "actualizarCapitulo") {
    let dataActualizar = {
      'capitulos.$.titulo' : titulo,
      'capitulos.$.numero' : numero,
      'capitulos.$.slug' : slug,
      'capitulos.$.estado' : estado
      }
    //actualizar contenido
    await Contenido.findByIdAndUpdate(id_contenido, {contenido, nota
      }).then(async() => {
        await Novela.findOneAndUpdate({'capitulos._id': req.params.id },
            { 
              $set: dataActualizar
          }).then(() => {
            res.send({title: '¡Actualizado con éxito!', 
                      message: 'Capitulo actualizado correctamente compa.', 
                      status: 'success'});
          }).catch((err) => {
            logger.error(err);
            res.send({title: '¡Error al actualizar!', 
                      message: err.code, 
                      status: 'error'});
          });
      }).catch((err) => {
        logger.error(err)
        res.send({
          title: '¡Error al actualizar!', 
          message: err.code, 
          status: 'error'
        });
      });
  } else {
    res.send("por aqui no se actualiza papu")
  }
  
}

capituloCtrl.borrarCapitulo = async (req, res) => {
  if (req.body.method == 'borrarCapitulo') {
    await Contenido.findByIdAndDelete(req.body.id_contenido)
      .then(async() => {
        await Novela.update({},
                      { $pull: { capitulos: { _id: req.params.id } } },
                      { multi: false 
                  }).then(() => {
                    res.send({title: 'Borrado con éxito!', 
                              message: 'Capitulo borrado correctamente compa.', 
                              status: 'success'});
                  }).catch((err) => {
                    logger.error(err);
                    res.send({title: '¡Error al borrar!', 
                              message: err.code, 
                              status: 'error'});
                  });
    }).catch((error) => {
          logger.error(error);
          res.send({title: '¡Error en el servidor!', 
                    status: 'error',
                    message: 'El contenido del cap no se eliminó.', 
                    errorData: dataError});
    });
  } else {
    res.send("Estas intentando borrar por medios sospechosos papu")
  }
}

capituloCtrl.getCapitulosXNovelas = async (req, res) => {
  await Novela.find({_id: req.params.id})
              .populate({
                path:'capitulos.contenido',
                match: { tipo: { $gte: 'primario' } },
                select: 'traductor.nombre'
              })
              .select({capitulos: 1, titulo: 1})
              .exec(function (err, docs) {
                if (err){
                  logger.error(err)
                  res.send({message: "Error en el servidor."})
                }
                res.send(docs)
              });
}

capituloCtrl.ActualizarEstado = async (req, res) => {
  if (req.body.method == "actualizarEstado") {
    await Novela.findOneAndUpdate({'capitulos._id': req.params.id },
                      { 
                        $set: {
                          'capitulos.$.estado': req.body.set.estado
                        }
                    }).then(() => {
                      res.send({title: '¡Actualizado con éxito!', 
                                message: 'Capitulo actualizado correctamente compa.', 
                                status: 'success'});
                    }).catch((err) => {
                      logger.error(err);
                      res.send({title: '¡Hubo un error en el servidor!', 
                                message: err.code, 
                                status: 'error'});
                    });
  } else {
    res.send("Error papu, por aqui no se actualiza")
  }
}

module.exports = capituloCtrl;