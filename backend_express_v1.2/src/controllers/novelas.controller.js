const cloudinary = require('cloudinary');
const fs = require('fs-extra');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const novelasCtrl = {};

const Novela = require('../models/Novela');

novelasCtrl.getNovelas = async (req, res) => {
    const novelas = await Novela.find();
    res.json(novelas)
}

novelasCtrl.crearNovela = async (req, res) => {
    console.log(req.body);
    const { titulo, 
            acron,
            titulo_alt,
            autor,
            sinopsis,
            estado,
            tipo,
            categoria,
            etiquetas  } = req.body;
    let images = [];
    console.log(req);
    for ( element of req.files) {
        images.push(await cloudinary.v2.uploader.upload(element.path, {use_filename: true}));
        
    };
    portada.titulo;
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
        imagen_portada: portada
    })
    console.log("aqui viene el cloud")
    console.log(images);
    
    res.send('recibido compa')
}

novelasCtrl.getNovela = async (req, res) => {
    const novela = await Novela.findById(req.params.id);
    console.log(novela);
    res.json({titulo: 'asasfdasd'});
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
    await Novela.findByIdAndDelete(req.params.id);
    res.json({message: 'Novela borrada'})
}

module.exports = novelasCtrl;