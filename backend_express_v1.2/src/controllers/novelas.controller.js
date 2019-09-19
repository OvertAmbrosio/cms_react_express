const novelasCtrl = {};

const Novela = require('../models/Novela');

novelasCtrl.getNovelas = async (req, res) => {
    const novelas = await Novela.find();
    res.json(novelas)
}

novelasCtrl.crearNovela = async (req, res) => {
    const { titulo, contenido, autor } = req.body;
    const nuevaNovela = new Novela({
        titulo,
        contenido,
        autor
    });
    await nuevaNovela.save();
    res.json({message: 'Novela Guardada'});
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