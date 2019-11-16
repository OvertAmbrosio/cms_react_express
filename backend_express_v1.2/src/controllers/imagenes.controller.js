const imagenCtrl = {};

const fs = require('fs-extra');
const path = require('path');
const AWS = require('aws-sdk');
//AWS S3
const bucket = process.env.S3_BUCKET;
const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ID,
  secretAccessKey: process.env.S3_SECRET,
  Bucket: bucket
});

const Imagen = require('../models/Imagen');

imagenCtrl.getImagenes = async (req, res) => {
  await Imagen.find().populate('id_novela', 'titulo').sort({updatedAt:-1}).
  exec(function (err, imgs) {
    if (err){
      console.log(err);
      res.send({message: "Error en el servidor."})
    }
    res.json(imgs)
  });
}

imagenCtrl.subirImagen = async (req, res) => {
  if (req.body.method === "subirImagen") {
    const file = {
      Bucket: bucket,
      ACL: "public-read",
      Key: req.body.Key, // File name you want to save as in S3
      Body: fs.readFileSync(req.file.path)
    };
    try {
      let rp = await s3.upload(file).promise();
      await fs.unlink(path.resolve(req.file.path));
      res.send({data: rp, status: "success", message: "Imagen subida correctamente papu."})
    } catch (error) {
      console.log(error);
      res.send({data: error, status: "error", message: "Hubo un problema en el servidor papu."})
    }
  } else {
    res.send("Que haces papu, por ahi no se sube")
  }
}

imagenCtrl.getImagen = async (req, res) => {
  const capitulo = await Imagen.findById(req.params.id);
  res.json(capitulo)
}

imagenCtrl.actualizarImagen = async (req, res) => {
  const { id_novela,
          titulo,
          nota,
          numero,
          estado,
          contenido,
          traductor,
          slug } = req.body;
  try {
    let r = await Imagen.findByIdAndUpdate( req.params.id,{ 
                  id_novela,
                  titulo,
                  nota,
                  numero,
                  estado,
                  contenido,
                  traductor,
                  slug});
    console.log(r);
    res.send({
      title: '¡Actualizado con éxito!', 
      message: 'Imagen actualizado correctamente compa.', 
      status: 'success'
    });
  } catch (error) {
    console.log(error);
    res.send({
      title: '¡Error al actualizar!', 
      message: error.errors[Object.keys(error.errors)[0]].message, 
      status: 'error'
    });
  };

}

imagenCtrl.borrarImagen = async (req, res) => {
  if (req.body.method == "borrarImagen") {
    try {
      let ria = await s3.deleteObject({Bucket: bucket, Key: req.body.key}).promise();
      console.log("Imagen elimanada de AWS")
    } catch (error) {    
      res.send({title: 'Error en el servidor!', 
                status: 'error', 
                message: 'No se pudo eliminar del servidor',
                errorData: error})     
      console.log(error);
    }
    //Borrar la novela
    try {
      const rn = await Imagen.findByIdAndDelete(req.params.id);
      res.send({title: 'Imagen Eliminada!', 
                status: 'success', 
                message: 'Imagen eliminada exitosamente'})      
    } catch (error) {
      res.send({title: '¡Error en el servidor!', 
                status: 'error', 
                message: 'La imagen no se eliminó, presiona F12/Console y envia la captura al administrador.', 
                errorData: error});
      console.log(error);
    }
  } else {
    res.send({title: '¡Error!', 
              status: 'error', 
              message: 'Estas intentando borrar por medio no oficiales papu'})
  }
}

imagenCtrl.getImagensXNovelas = async (req, res) => {
  const capitulos = await Imagen.find({id_novela: req.params.id}).sort({numero:-1});
  res.json(capitulos)
}
  


module.exports = imagenCtrl;