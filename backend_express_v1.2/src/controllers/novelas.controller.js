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
const Contenido = require('../models/CapituloContenido');

novelasCtrl.getNovelasEmision = async (req, res) => {
  await Novela.find({
                estado: "Emision"
              },{
                capitulos: { $elemMatch: { estado: "Aprobado" } },
                imagenes: { $elemMatch: { tipo: "Portada" } },
              },{
                "capitulos.$": 1,
                "imagenes.$": 1,
              }).limit(8).select({
                titulo:1, acron:1
              }).exec(function(err, results){
                if(err){
                  logger.error(err);
                  res.send({message: "Error en el servidor", err: err.code})
                } else {
                  res.json(results)
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
              .select({titulo:1, slug:1, tipo:1, uploadedBy:1, updatedAt: 1, estado:1, imagenes: 1})
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
      titulo, titulo_alt, acron, autor, sinopsis, tipo, estado, categorias, etiquetas, uploadedBy, imagenes
    });
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
  let dataMessages = {imagenes_s3: [], contenido: '', imagen: '', capitulo: '' };
  let dataError = {imagenes_s3: [], contenido: '', otros: [] };
  //borrar la novela
  const borrarNovelaQuery = async() => {
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
  }
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
    //comprobar que haya capitulos y borrar novela
    try {
      await Novela.findById(req.params.id)
        .select({capitulos:1, _id:0})
        .then(async (data) => {
          let x = 0;
          (data.capitulos).map((d) => (
            (d.contenido).map((c) => {
              x = x+1
              Contenido.findByIdAndDelete(c)
                .then(() => {
                  dataMessages.contenido = 'se eliminó: ' + x + ' capitulos';
              }).catch((err) => {
                  logger.error(err);
                  dataError.contenido = 'Error eliminando contenido ' + c;
              })
            })
          ))
          //borrar novela
          borrarNovelaQuery();
        }).catch((err) => {
          logger.error(err);
          (dataError.otros).push('Error en el servidor');
        });
      
    } catch (error) {
      logger.error(err);
      res.send({title: '¡Error!', 
                status: 'error',
                message: 'Hubo un error papu',
                errorData: dataError})
    } 
  } else {
    res.send({title: '¡Error!', 
              status: 'error',
              message: 'Esa no es la forma de borrar papu'})
  }
}

module.exports = novelasCtrl;