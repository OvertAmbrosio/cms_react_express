const cloudinary = require('cloudinary');
const fs = require('fs-extra');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const novelasCtrl = {};

const Novela = require('../models/Novela');

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
    const novelas = await Novela.find().sort({createdAt:-1});
    res.json(novelas)
}

novelasCtrl.crearNovela = async (req, res) => {
    const { titulo, 
            acron,
            titulo_alt,
            autor,
            sinopsis,
            estado,
            tipo,
            categoria,
            etiquetas,
            createdBy  } = JSON.parse(req.body.novela);
            
    let rportada = await cloudinary.v2.uploader.upload(req.files.portada[0].path, {use_filename: true});
    let rmini = await cloudinary.v2.uploader.upload(req.files.mini[0].path, {use_filename: true});

    var portada = {
        titulo: rportada.original_filename,
        url: rportada.secure_url,
        public_id: rportada.public_id
    }

    var mini = {
        titulo: rmini.original_filename,
        url: rmini.secure_url,
        public_id: rmini.public_id
    }

    const nuevaNovela = new Novela({
        titulo,
        acron,
        titulo_alt,
        autor,
        sinopsis,
        tipo,
        estado,
        categoria,
        etiquetas,
        imagen_portada: portada,
        imagen_mini: mini,
        createdBy
    })
    console.log("aqui viene el cloud")
    console.log(rportada);
    console.log(rmini);
    console.log('esto guarda')
    console.log(nuevaNovela);
    await nuevaNovela.save();
    await fs.unlink(path.resolve(req.files.portada[0].path));
    await fs.unlink(path.resolve(req.files.mini[0].path));
    res.send('Guardado Con éxito Compa.!');
}

novelasCtrl.getNovela = async (req, res) => {
    const novela = await Novela.findById(req.params.id);
    console.log(novela);
    res.json({titulo: 'novela encontrada compa'});
}

novelasCtrl.actualizarNovela = async (req, res) => {
    const { titulo, contenido, autor } = req.body;
    await Novela.findByIdAndUpdate(req.params.id, {
        titulo,
        contenido,
        autor
    });
    res.json({message: 'novela actualizada'});
}

novelasCtrl.borrarNovela = async (req, res) => {
    const bn = await Novela.findById(req.params.id);
    console.log("portada");
    const pres = await  cloudinary.v2.uploader.destroy(
                            bn.imagen_portada.public_id, function(error,result) {
                            console.log(result, error) 
                        });
    console.log("mini");
    const mres = await  cloudinary.v2.uploader.destroy(
                            bn.imagen_mini.public_id,function(error,result) {
                            console.log(result, error) 
                        });
    console.log(bn.titulo);
    await Novela.findByIdAndDelete(bn._id);
    res.json({message: 'Novela borrada'})
}

module.exports = novelasCtrl;