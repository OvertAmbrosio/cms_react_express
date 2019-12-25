const imagenCtrl = {};
const logger = require('../utils/logger');

const fs = require('fs-extra');
const path = require('path');
const AWS = require('aws-sdk');
//AWS S3
const bucket = process.env.S3_BUCKET;
AWS.config.update({
  accessKeyId: process.env.S3_ID, 
  secretAccessKey: process.env.S3_SECRET
});

const s3 = new AWS.S3();

const Novela = require('../models/Novela');

imagenCtrl.getImagenes = async (req, res) => {
  await Novela.find().select({imagenes: 1, titulo: 1}).
  exec(function (err, imgs) {
    if (err){
      console.log(err);
      res.send({message: "Error en el servidor."})
    }
    res.json(imgs)
  });
}

imagenCtrl.subirImagen = async (req, res) => {
  //comprobar si el metodo es para subir una imagen (al s3)
  if (req.body.method === "subirImagen") {
    //objeto para enviar y validar
    const fileValidator = {
      Bucket: bucket,
      Key: req.body.Key, // File name you want to save as in S3
    };
    //objecto para guardar
    const file = {
      Bucket: bucket,
      ACL: "public-read",
      Key: req.body.Key, // File name you want to save as in S3
      Body: fs.readFileSync(req.file.path),
      ContentType: req.body.type
    };
    //funcion para subir la imagen al s3
    const upload = async () => {
      let s3Imagen = new Object();
      await s3.upload(file).promise()
              .then((imagen) => {
                s3Imagen = imagen;
            }).then( async() => {
              await fs.unlink(path.resolve(req.file.path));
              res.send({data: s3Imagen, 
                        status: "success", 
                        message: "Imagen subida correctamente papu."})
            }).catch((err) => {
              logger.error(err);
              res.send({data: err, 
                        status: "error", 
                        message: "Hubo un problema en el servidor papu."})
            });
    }
    //comprobar si se necesita validar la imagen (que no sea repetida)
    if (req.query.validar) {
      s3.headObject(fileValidator).promise()
        .then(() => {
          res.send({status: "warning", 
                    message: "Ya existe una imagen de "})
      }).catch((err) => {
        //validar si el error es porque no se encontró la imagen(osea no es repetida)
        if (err.code == "NotFound") {
          //si la imagen no se encuentra en el S3 entonces se usa la funcion upload() para subir el archivo al s3.
          upload();
        } else {
          logger.error(err);
          res.send({status: "error", 
                    message: "Error en el servidor"})
        }  
      })
    } else {
      //si no es necesario validar entonces se envia la imagen 
      upload();
    }
  //comprobar si guarda la imagen a la base de datos
  } else if (req.body.method === "guardarImagen") {
    const { id_novela, titulo, tipo, contentType, url, key } = req.body.data;
    await Novela.findByIdAndUpdate({
                  _id: id_novela
                }, {
                  $push: {
                    imagenes: {titulo, tipo, contentType, url, key}
                  }
              }).then((r) => {
                res.send({title: '¡Guardado con éxito!', 
                          message: 'Imagen guardada correctamente compa.', 
                          status: 'success'});
              }).catch((err) => {
                logger.error(err);
                      res.send({title: '¡Error al guardar!', 
                                message: err._message? err._message:err.code, 
                                status: 'error'});
              });
  } else {
    res.send("Que haces papu, por ahi no se sube")
  }
}

imagenCtrl.getImagen = async (req, res) => {
  await Novela.findOne({'imagenes._id' : req.params.id}, {'imagenes.$': 1})
              .select({_id:0})
              .then((imagen) => { 
                console.log(imagen.imagenes[0]);
                res.json(imagen.imagenes[0])
              }).catch((err) => {
                logger.error(err)
                res.send('Error en el servidor')
              });
}

imagenCtrl.actualizarImagen = async (req, res) => {
  if (req.body.method === "actualizarImagen") {
    const { id_novela, titulo, tipo, contentType, url, key } = req.body.data;
    let newURL = 'https://s3.amazonaws.com/imagenes.tunovelaonline/' + req.body.data.key;
    await s3.copyObject({
            ACL: "public-read",
            Bucket: bucket, 
            CopySource: `${bucket}/${req.body.oldKey}`, 
            Key: req.body.data.key
          }).promise()
            .then((img) => {
              console.log(img)
              s3.deleteObject({
                Bucket: bucket, 
                Key: req.body.oldKey
              }).promise().catch((err) => {
                logger.error(err);
                console.log("error borrando antigua imagen")
              })
          }).then( async() => {
            await Novela.findOneAndUpdate({
                          'imagenes._id' : req.params.id } , {
                            $set : {
                              'imagenes.$.titulo': titulo, 
                              'imagenes.$.tipo': tipo, 
                              'imagenes.$.contentType': contentType, 
                              'imagenes.$.url': newURL, 
                              'imagenes.$.key': key
                            }
                        }).then(() => {
                          res.send({title: '¡Actualizado con éxito!', 
                                    message: 'Imagen actualizado correctamente compa.', 
                                    status: 'success'
                                  });
                        }).catch((err) => {
                          logger.error(err);
                          res.send({title: '¡Error al actualizar!', 
                                    message: err.error.code, 
                                    status: 'error'
                                  });
                        })
          }).catch((err) => {
              logger.error(err);
              res.send({title: '¡Error al actualizar!', 
                        message: 'Error actualizando objeto en el S3', 
                        status: 'error'
                      });
          });
  }
}

imagenCtrl.borrarImagen = async (req, res) => {
  let errorData = '';
  let messageData = '';
  //funcion para eliminar la imagen del amazon S3
  const eliminarImagenS3 = async () => {
    await s3.deleteObject({Bucket: bucket, Key: req.body.key})
            .promise()
            .then((r) => {
              logger.info(r);
              messageData = 'Imagen del S3 borrado';
          }).catch((err) => {
              logger.error(err);
              res.send({title: '¡Error en el servidor!', 
                        status: 'error', 
                        message: 'Error en el servidor',
                        errorData: error.codeName})
            });
  }
  //condicionar los metodos para eliminar la imagen del s3 y de la bade de datos
  if (req.body.method == "borrarImagen") {
    // borra la imagen del S3
    await eliminarImagenS3();
    //Borrar la imagen de la base de datos  
     await Novela.updateOne({ 'imagenes._id': req.params.id},
                    { $pull: { imagenes: { _id: req.params.id } } },
                    { multi: false 
                }).then(() => {
                  res.send({title: 'Imagen Eliminada!', 
                            status: 'success', 
                            message: 'Imagen eliminada exitosamente',
                            messageData: messageData})  
                }).catch((err) => {
                  logger.error(err);
                  res.send({title: '¡Error en el servidor!', 
                            status: 'error', 
                            message: 'La imagen no se eliminó.', 
                            errorData: errorData});
                });    
  } else if (req.body.method == "borrarImagenS3"){
    await eliminarImagenS3().then(() => {
      res.send({title: 'Imagen Eliminada!', 
                            status: 'success', 
                            message: 'Imagen eliminada exitosamente',
                            messageData: messageData})
    });
  } else {
    res.send({title: '¡Error!', 
              status: 'error', 
              message: 'Estas intentando borrar por medio no oficiales papu'})
  }
}

imagenCtrl.getImagensXNovelas = async (req, res) => {
  await Novela.findOne({_id: req.params.id})
              .select({imagenes: 1,})
              .exec(function (err, imgs) {
                if (err){
                  logger.error(err)
                  res.send({message: "Error en el servidor."})
                }
                res.send(imgs.imagenes)
              });
}
  


module.exports = imagenCtrl;