const capituloCtrl = {};
const logger = require('../utils/logger');

const Capitulo = require('../models/Capitulo');

capituloCtrl.getCapitulos = async (req, res) => {
  await Capitulo.find().populate('id_novela', 'titulo').sort({updatedAt:-1}).
  exec(function (err, caps) {
    if (err){
      console.log(err);
      res.send({message: "Error en el servidor."})
    }
    res.json(caps)
  });
}

capituloCtrl.crearCapitulo = async (req, res) => {
  const { id_novela,
          titulo,
          nota,
          numero,
          estado,
          contenido,
          traductor,
          slug } = req.body.data;

  const nuevoCapitulo = new Capitulo({id_novela,titulo,nota,numero,estado,contenido,traductor,slug});

  if (req.body.method == 'crearCapitulo') {
    await nuevoCapitulo.save()
                       .then(() => {
                          res.send({
                            title: '¡Guardado con éxito!', 
                            message: 'Capitulo guardado correctamente compa.', 
                            status: 'success'
                          });
                      }).catch((err) => {
                        logger.error(err);
                        res.send({
                          title: '¡Error al guardar!', 
                          message: err._message, 
                          status: 'error'
                        });
                      });
  } else {
    res.send('Por aqui no se hace eso papu')
  }
}

capituloCtrl.getCapitulo = async (req, res) => {
  await Capitulo.findById(req.params.id)
                .then((capitulo) => {
                  res.send(capitulo);
                }).catch((err) => {
                  logger.error(err);
                  res.send("Error en el servidor")
                });
}

capituloCtrl.actualizarCapitulo = async (req, res) => {
  const { id_novela, titulo, nota, numero, estado, contenido, traductor, slug } = req.body.data;
  if (req.body.method == "actualizarCapitulo") {
    await Capitulo.findByIdAndUpdate(req.params.id,
                                      { id_novela, titulo, nota, numero, estado, contenido,traductor, slug })
                  .then(() => {
                    res.send({
                      title: '¡Actualizado con éxito!', 
                      message: 'Capitulo actualizado correctamente compa.', 
                      status: 'success'
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
    await Capitulo.findByIdAndDelete(req.params.id)
                .then(() => {
                  res.send({
                    title: 'Borrado con éxito!', 
                    message: 'Capitulo borrado correctamente compa.', 
                    status: 'success'
                  });
              }).catch((err) => {
                logger.log(err)
                res.send({
                  title: '¡Error al borrar!', 
                  message: err.code, 
                  status: 'error'
                });
              });
  } else {
    res.send("Estas intentando borrar por medios sospechosos papu")
  }
}

capituloCtrl.getCapitulosXNovelas = async (req, res) => {
  await Capitulo.find({id_novela: req.params.id})
                .sort({numero:-1})
                .then((data) => {
                  res.send(data);
              }).catch((err) => {
                logger.error(err);
                res.send('No se encontraron datos');
              });
}

capituloCtrl.BusquedaXNumero = async (req, res) => {
  if (req.query.idNovela) {
    await Capitulo.find( {id_novela: req.query.idNovela, 
                            $or:[{traductor: new RegExp(req.query.var, "i")},
                                {numero: isNaN(req.query.var)?'':req.query.var}]
                }).sort({numero:-1})
                  .then((capitulo) => {
                  if (capitulo.length > 0) {
                    res.send(capitulo);
                  } else {
                    res.send({message: "Sin Resultados"})
                  }
                }).catch((err) => {
                  logger.error(err);
                  res.send({message: err.message})
                });    
  } else {
    await Capitulo.find({ $or:[ {traductor: new RegExp(req.query.var, "i")},
                                {numero: isNaN(req.query.var)?'':req.query.var}]
                }).populate('id_novela', 'titulo')
                  .sort({updatedAt:-1})
                  .then((capitulo) => {
                    if (capitulo.length > 0) {
                    res.send(capitulo);
                    } else {
                    res.send({message: "Sin Resultados"})
                    }
                  }).catch((err) => {
                    logger.error(err);
                    res.send({message: err.message})
                  });
  }
}

capituloCtrl.ActualizarEstado = async (req, res) => {
  if (req.body.method == "actualizarEstado") {
    await Capitulo.updateOne({_id: req.params.id}, { $set: req.body.set })
                  .then(() => {
                    res.send({
                      title: '¡Actualizado con éxito!', 
                      message: 'Capitulo actualizado correctamente compa.', 
                      status: 'success'
                    });
                  }).catch((err) => {
                    logger.error(err);
                    res.send({
                      title: '¡Hubo un error en el servidor!', 
                      message: err.code, 
                      status: 'error'
                    });
                  })
  } else {
    res.send("Error papu, por aqui no se actualiza")
  }
}

module.exports = capituloCtrl;