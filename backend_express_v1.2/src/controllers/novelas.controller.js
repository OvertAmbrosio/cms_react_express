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
const Capitulo = require('../models/Capitulo');

novelasCtrl.getNovelasEmision = async (req, res) => {
   await Capitulo.find({estado: 'Aprobado'}, { id_novela: { $slice: 1 } })
                .populate({
                  path:'id_novela', 
                  select: 'titulo acron estado',
                  match: {"estado": "Emision"},
                  options: { limit: 2 }
                })
                .sort({numero:-1})
                .then((novelas, err) => {
                  if (err) {
                    logger.error(err);
                    res.send({message: "Error en el servidor", err: err.code})
                  } else {
                    res.json(novelas)
                  }
                });
} 

novelasCtrl.buscarNovelas = async (req, res) => {
    await Novela.find({$or: [ {"titulo": new RegExp(req.params.var, "i")}, 
                              {"uploadedBy.nombre": new RegExp(req.params.var, "i")} ]
              }).select(
                {titulo:1, slug:1, tipo:1, uploadedBy:1, updatedAt: 1, estado:1, imagenes: 1}
              ).sort(
                {createdAt:-1}
              ).then((novela, err) => {
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
              .select({titulo:1, slug:1, tipo:1, uploadedBy:1, updatedAt: 1, estado:1, imagenes: 1, capitulos: 1})
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
  if (req.body.method === "crearNovela") {
    //declarar variables
    let dataMessages = new Object();
    let dataError = new Object();
    //obtener datos del request
    const { 
      titulo, titulo_alt, acron, autor, sinopsis, estado, tipo, categorias, etiquetas, uploadedBy, imagenes 
    } = req.body;
    //objetos a guardar
    let nuevaNovela = new Novela({ 
      titulo, titulo_alt, acron, autor, sinopsis, tipo, estado, categorias, etiquetas, uploadedBy, imagenes});
    //guardando novela              
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
              .select({capitulos:0, clasificacion: 0})
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
            etiquetas} = req.body;
    await Novela.findByIdAndUpdate(req.params.id,{ 
      titulo,
      acron,
      titulo_alt,
      autor,
      sinopsis,
      tipo,
      estado,
      categorias,
      etiquetas
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
  let dataMessages = {imagenes_s3: [] };
  let dataError = {imagenes_s3: [] };
  if (req.body.method == "borrarNovela") {
    //Comprobar que haya imagenes
    if ((req.body.imagenes).length > 0) {
      (req.body.imagenes).map(async (imagen, index) => {
        let aux = index;
        await s3.deleteObject({Bucket: bucket, Key: imagen.key})
                .promise()
                .then(dataMessages.imagenes_s3[aux] = `Se eliminó ${imagen.key} correctamente del S3.`)
                .catch((err) => {
                  logger.error(err);
                  dataError.imagenes_s3[aux] = `Error borrando imagen ${imagen.key}.`
                });
      });
    } else {
      dataMessages.imagen = "No se encontraron imagenes";
    }
    //comprobar que haya capitulos
    if ((req.body.capitulos).length > 0) {
      await Novela.findById(req.params.id)
              .select({capitulos:1, _id:0})
              .then((data) => {
                data.map((d) => (
                  (d.contenido).map((c) => (
                    console.log(c)
                  ))
                ))
              }).catch((err) => {
                logger.error(err);
                res.send('Error en el servidor');
              });
    } else {
      dataMessages.imagen = "No se encontraron capitulos";
    }
    //Borrar la novela
    // await Novela.findByIdAndDelete(req.params.id)
    //             .then(() => {
    //               res.send({title: '¡Novela Eliminada!', 
    //                         status: 'success', 
    //                         message: 'Novela eliminada exitosamente',
    //                         dataMessages: dataMessages});
    //             }).catch((error) => {
    //                 logger.error(error);
    //                 res.send({title: '¡Error en el servidor!', 
    //                           status: 'error',
    //                           message: 'La novela no se eliminó, presiona F12/Console y envia la captura al administrador.', 
    //                           errorData: dataError});
    //             });
  } else {
    res.send({title: '¡Error!', 
              status: 'error',
              message: 'Esa no es la forma de borrar papu'})
  }
}

module.exports = novelasCtrl;