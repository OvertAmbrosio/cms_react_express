const novelasTipoCtrl = {};

const NovelaTipo = require('../models/NovelaTipo');

novelasTipoCtrl.getNovelaTipo = async (req, res) => {
    const novelatipo = await NovelaTipo.find();
    res.json(novelatipo)
}

novelasTipoCtrl.crearNovelaTipo = async (req, res) => {
    const { nombre, descripcion } = req.body;
    const nuevoNovelaTipo = new NovelaTipo({
      nombre,
      descripcion
    });
    await nuevoNovelaTipo.save();
    res.json({message: 'Novela Tipo Guardada'});
}

novelasTipoCtrl.actualizarNovelaTipo = async (req, res) => {
    const { nombre, descripcion } = req.body;
    await NovelaTipo.findByIdAndUpdate(req.params.id, {
      nombre,
      descripcion
    });
    res.json({message: 'Novela Tipo actualizada'});
}

novelasTipoCtrl.borrarNovelaTipo = async (req, res) => {
    await NovelaTipo.findByIdAndDelete(req.params.id);
    res.json({message: 'Novela Tipo borrada'})
}

module.exports = novelasTipoCtrl;