const novelasCateCtrl = {};

const NovelaCate = require('../models/NovelaCate');

novelasCateCtrl.getNovelaCate = async (req, res) => {
    const novelacate = await NovelaCate.find();
    res.json(novelacate)
}

novelasCateCtrl.crearNovelaCate = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const nuevoNovelaCate = new NovelaCate({
      nombre,
      descripcion
    });
    await nuevoNovelaCate.save();
    res.json({message: 'Novela Categoria Guardada'});
}

novelasCateCtrl.actualizarNovelaCate = async (req, res) => {
    const { nombre, descripcion } = req.body;
    await NovelaCate.findByIdAndUpdate(req.params.id, {
      nombre,
      descripcion
    });
    res.json({message: 'Novela Categoria actualizada'});
}

novelasCateCtrl.borrarNovelaCate = async (req, res) => {
    await NovelaCate.findByIdAndDelete(req.params.id);
    res.json({message: 'Novela Categoria borrada'})
}

module.exports = novelasCateCtrl;