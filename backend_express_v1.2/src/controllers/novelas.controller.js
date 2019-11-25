const AWS = require('aws-sdk');
const logger = require('../utils/logger');
//AWS S3
const bucket = process.env.S3_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_SECRET,
  Bucket: bucket
});

const novelasCtrl = {};

const Novela = require('../models/Novela');
const Imagen = require('../models/Imagen');
const Capitulo = require('../models/Capitulo');

novelasCtrl.buscarNovelas = async (req, res) => {
    await Novela.find({$or: [ {"titulo": new RegExp(req.params.var, "i")}, 
                              {"createdBy": new RegExp(req.params.var, "i")} ]
              }).then((novela, err) => {
                if (err){
                  logger.error(err);
                  res.send({message: "Error en el servidor papu"})
                } else if (novela.length > 0) {
                  res.send(novela);
                } else {
                  res.send({message: "Sin Resultados"})
                }
              });
}

novelasCtrl.getNovelas = async (req, res) => {
  await Novela.find()
              .select({titulo:1, slug:1, tipo:1, createdBy:1, updatedAt: 1, estado:1})
              .sort({createdAt:-1})
              .then((novelas, err) => {
                if (err) {
                  logger.error(err);
                  res.send({message: "Error en el servidor", err: err.code})
                } else {
                  res.json(novelas)
                }
              });
}

novelasCtrl.crearNovela = async (req, res) => {
  if (req.body.method == "crearNovela") {
    //declarar variables
    let dataMessages = new Object();
    let dataError = new Object();
    //obtener datos del request
    const { titulo, 
            acron,
            titulo_alt,
            autor,
            sinopsis,
            estado,
            tipo,
            categorias,
            etiquetas,
            portada,
            miniatura,
            createdBy  } = req.body;
    //objetos a guardar
    let nuevaNovela = new Novela({ titulo,
                      acron,
                      titulo_alt,
                      autor,
                      sinopsis,
                      tipo,
                      estado,
                      categorias,
                      etiquetas,
                      createdBy});

    let portadaObj = new Imagen({ id_novela: nuevaNovela._id,
                                  titulo: nuevaNovela.titulo + " Portada",
                                  tipo: "Portada",
                                  contentType: portada.type,
                                  url: portada.data.Location,
                                  key: portada.data.Key});

    let miniaturaObj = new Imagen({ id_novela: nuevaNovela._id,
                                    titulo: nuevaNovela.titulo + " Miniatura",
                                    tipo: "Miniatura",
                                    contentType: portada.type,
                                    url: miniatura.data.Location,
                                    key: miniatura.data.Key});
    //guardar en la base de datos gg
    await portadaObj.save(function(err) {
                      if (err) {
                        logger.error(err);
                        dataError.portada = err.code;
                      } else {
                        dataMessages.portada = "Portada guardada Correctamente"
                      }
                    })
                    
    await miniaturaObj.save(function(err) {
                        if (err) {
                          logger.error(err);
                          dataError.miniatura = err.code;
                        } else {
                          dataMessages.miniatura = "Miniatura guardada Correctamente"
                        }
                      })

    await nuevaNovela.save()
                     .then(() => {
                        dataMessages.novela = "Novela Guardada";
                        res.send({title: 'Guardado Con éxito Compa.!', 
                                  message: 'Novela creada correctamente.', 
                                  status: 'success',
                                  dataMessages: dataMessages });
                    }).catch((err) => {
                      logger.error(err);
                      dataError.novela = err.name;
                      res.send({title: '¡Error!', 
                                message: "Codigo de Error: " + err.code, 
                                status: 'error', 
                                dataError: dataError})
                      });
  //en caso no use el metedo adecuado
  } else {
    res.send({title: '¡Error!', message: 'Metodo incorrecto papu, ¿Por dónde tratas de entrar?', status: 'error', errorData:''})
  }
}

novelasCtrl.getNovela = async (req, res) => {
    await Novela.findById(req.params.id)
                .then((data) => {
                  res.send(data);
                }).catch((err) => {
                  logger.error(err);
                  res.send('Error en el servidor');
                });
}

novelasCtrl.actualizarNovela = async (req, res) => {
  if(req.body.method == "editarNovela"){
    const { titulo, 
            titulo_alt,
            acron,
            autor,
            sinopsis,
            estado,
            tipo,
            categorias,
            etiquetas,
            createdBy} = req.body;
    await Novela.findByIdAndUpdate(req.params.id,{ 
      titulo,
      acron,
      titulo_alt,
      autor,
      sinopsis,
      tipo,
      estado,
      categorias,
      etiquetas,
      createdBy 
    }).then(function () {
      res.send({title: '¡Novela Actualizada!', 
                message: 'Novela actualizada correctamente compa.', 
                status: 'success'});
    }).catch((err) => {
      logger.error(err);
      res.send({title: '¡Error en el servidor!', 
                message: err.codeName,
                status: 'error',
                errorData: err.name});
    });
  } else {
    res.send({title: '¡Error!', 
              message: 'Estas actualizando por metodos no oficiales papu.', 
              status: 'error'});
  }
}

novelasCtrl.borrarNovela = async (req, res) => {
  let dataMessages = {imagenes_s3: [], imagenes_db: '', capitulos:'' };
  let dataError = {imagenes_s3: [], imagenes_db: '', capitulos:'' };
  if (req.body.method == "borrarNovela") {
    const imagenes = await Imagen.find({id_novela:req.params.id});
    if (imagenes.length > 0) {
      imagenes.map(async (imagen, index) => {
        let aux = index;
        await s3.deleteObject({Bucket: bucket, Key: imagen.key})
                .promise()
                .then(dataMessages.imagenes_s3[aux] = `Se eliminó ${imagen.key} correctamente del S3.`)
                .catch((err) => {
                  logger.error(err);
                  dataError.imagenes_s3[aux] = `Error borrando imagen ${imagen.key}.`
                });
      });
      await Imagen.deleteMany({id_novela: req.params.id})
                  .then(dataMessages.imagenes_db = `Se eliminó las imagenes correctamente de la base de datos.`)
                  .catch((err) => {
                    logger.error(err);
                    dataError.imagenes_db = `Error borrando imagen.`
                  });
      
    } else {
      dataMessages.imagen = "No se encontraron imagenes";
    }
    //borrar los capitulos de la novela
    await Capitulo.deleteMany({id_novela: req.params.id})
                  .then((rs) => {
                    if (rs.deletedCount>0) {
                      dataMessages.capitulos = `Se eliminó ${rs.deletedCount} capitulos correctamente de la base de datos.`
                    } else {
                      dataMessages.capitulos = "No se encontraron capitulos";
                    }
                }).catch((err) => {
                  logger.error(err);
                  dataError.capitulos = `Error eliminando capitulos.`
                });
    //Borrar la novela
    await Novela.findByIdAndDelete(req.params.id)
                .then(() => {
                  res.send({title: '¡Novela Eliminada!', 
                            status: 'success', 
                            message: 'Novela eliminada exitosamente',
                            dataMessages: dataMessages});
                }).catch((error) => {
                    logger.error(error);
                    res.send({title: '¡Error en el servidor!', 
                              status: 'error',
                              message: 'La novela no se eliminó, presiona F12/Console y envia la captura al administrador.', 
                              errorData: dataError});
                });
  } else {
    res.send({title: '¡Error!', 
              status: 'error',
              message: 'Esa no es la forma de borrar papu'})
  }
}

module.exports = novelasCtrl;