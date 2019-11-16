const etiqueta = {};

const Etiqueta = require('../models/NovelaTag');

etiqueta.getEtiqueta = async (req, res) => {
    const etiqueta = await Etiqueta.find();
    res.json(etiqueta)
}

etiqueta.crearEtiqueta = async (req, res) => {
    const { id, text } = req.body;
    const nuevoEtiqueta = new Etiqueta({
      id,
      text
    });
    await nuevoEtiqueta.save();
    res.json({message: 'Etiqueta Guardada'});
}

etiqueta.actualizarEtiqueta = async (req, res) => {
    const { id, text } = req.body;
    await Etiqueta.findByIdAndUpdate(req.params.id, {
      id,
      text
    });
    res.json({message: 'Etiqueta actualizada'});
}

etiqueta.borrarEtiqueta = async (req, res) => {
    await Etiqueta.findByIdAndDelete(req.params.id);
    res.json({message: 'Etiqueta borrada'})
}

module.exports = etiqueta;