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

const novelasCtrl = {};

const Novela = require('../models/Novela');
const Imagen = require('../models/Imagen');

novelasCtrl.buscarNovelas = async (req, res) => {
    const titulo = await Novela.find({"titulo": new RegExp(req.params.var, "i")});
    const usuario = await Novela.find({"createdBy": new RegExp(req.params.var, "i")});
    if (titulo.length > 0) {
        res.json(titulo);
    } else if (usuario.length > 0) {
        res.json(usuario)
    } else {    
        res.json({message: "404"});
    }
    console.log(res.data)
}

novelasCtrl.getNovelas = async (req, res) => {
  try {
    const novelas = await Novela.find().select({titulo:1, slug:1, tipo:1, createdBy:1, updatedAt: 1}).sort({createdAt:-1});
    res.json(novelas)
  } catch (error) {
    res.send({message: "Error en el servidor", error: error})
  }
}

novelasCtrl.crearNovela = async (req, res) => {
  if (req.body.method == "crearNovela") {
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
    const nuevaNovela = new Novela({titulo,
                                  acron,
                                  titulo_alt,
                                  autor,
                                  sinopsis,
                                  tipo,
                                  estado,
                                  categorias,
                                  etiquetas,
                                  createdBy});

    const portadaObj = new Imagen({ id_novela: nuevaNovela._id,
                                    titulo: nuevaNovela.titulo + " Portada",
                                    tipo: "Portada",
                                    url: portada.Location,
                                    key: portada.Key});

    const miniaturaObj = new Imagen({ id_novela: nuevaNovela._id,
                                      titulo: nuevaNovela.titulo + " Miniatura",
                                      tipo: "Miniatura",
                                      url: miniatura.Location,
                                      key: miniatura.Key});
    //guardar en la base de datos
    try {
      await nuevaNovela.save();
      await portadaObj.save();
      await miniaturaObj.save();
      res.send({title: 'Guardado Con éxito Compa.!', message: 'Novela creada correctamente.', status: 'success'});
    } catch (error) {
      console.log(error);
      res.send({title: '¡Error!', message: error.errmsg, status: 'error', errorData:error})
    }
  //en caso no use el metedo adecuado
  } else {
    res.send({title: '¡Error!', message: 'Metodo incorrecto papu, ¿Por dónde tratas de entrar?', status: 'error', errorData:''})
  }
}

novelasCtrl.getNovela = async (req, res) => {
    const novela = await Novela.findById(req.params.id);
    res.send(novela);
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
    try {
      let r = await Novela.findByIdAndUpdate(req.params.id, {
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
      });
      res.send({title: '¡Novela Actualizada!', 
                message: 'Novela actualizada correctamente compa.', 
                status: 'success'});   
    } catch (error) {
      console.log("Uy un error compa");    
      console.log(error);
      res.send({title: '¡Error!', 
                message: 'No se ha actualizado, problema en el servidor.', 
                status: 'error', 
                errorData: error});
    } 
  } else {
    res.send({title: '¡Error!', 
              message: 'Estas actualizando por metodos no oficiales papu.', 
              status: 'error'});
  }
}

novelasCtrl.borrarNovela = async (req, res) => {
  if (req.body.method == "borrarNovela") {
    const imagenes = await Imagen.find({id_novela:req.params.id})
    if (imagenes.length > 0) {
      try {
        imagenes.map(async (imagen) => {
          let ria = await s3.deleteObject({Bucket: bucket, Key: imagen.key}).promise();
          let rio = await Imagen.findByIdAndDelete(imagen._id);
        })
      } catch (error) {
        console.log(error);
      }
    }
    //Borrar la novela
    try {
      const rn = await Novela.findByIdAndDelete(req.params.id);
      res.send({title: '¡Novela Eliminada!', status: 'success', message: 'Novela eliminada exitosamente'})      
    } catch (error) {
      res.send({title: '¡Error en el servidor!', status: 'error', message: 'La novela no se eliminó, presiona F12/Console y envia la captura al administrador.', errorData: error})
      console.log(error);
    }
  }
  
}

module.exports = novelasCtrl;