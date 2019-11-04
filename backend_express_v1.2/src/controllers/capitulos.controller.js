const capituloCtrl = {};

const Capitulo = require('../models/Capitulo');

capituloCtrl.getCapitulos = async (req, res) => {
  const capitulo = await Capitulo.find();
  res.json(capitulo)
}

capituloCtrl.crearCapitulo = async (req, res) => {
  const { id_novela,
          titulo,
          nota,
          numero,
          estado,
          contenido,
          traductor,
          slug } = req.body;
  const nuevoCapitulo = new Capitulo({
    id_novela,
    titulo,
    nota,
    numero,
    estado,
    contenido,
    traductor,
    slug 
  });
  console.log("Esto Guarda");
  console.log(nuevoCapitulo);
  try {
    await nuevoCapitulo.save();
    res.send({
      title: '¡Guardado con éxito!', 
      message: 'Capitulo guardado correctamente compa.', 
      status: 'success'
    });
  } catch (error) {
    res.send({
      title: '¡Error al guardar!', 
      message: error.errors[Object.keys(error.errors)[0]].message, 
      status: 'error'
    });
  }
}

capituloCtrl.getCapitulo = async (req, res) => {
  const capitulo = await Capitulo.findById(req.params.id);
  res.json(capitulo)
}

capituloCtrl.actualizarCapitulo = async (req, res) => {
  const { id_novela,
          titulo,
          nota,
          numero,
          estado,
          contenido,
          traductor,
          slug } = req.body;
  try {
    let r = await Capitulo.findByIdAndUpdate( req.params.id,{ 
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
      message: 'Capitulo actualizado correctamente compa.', 
      status: 'success'
    });
  } catch (error) {
    console.log(error);
    res.send({
      title: '¡Error al actualizar!', 
      message: error.errors.estado.message, 
      status: 'error'
    });
  };

}

capituloCtrl.borrarCapitulo = async (req, res) => {
  try {
    await Capitulo.findByIdAndDelete(req.params.id);
    res.send({
      title: 'Borrado con éxito!', 
      message: 'Capitulo borrado correctamente compa.', 
      status: 'success'
    });
  } catch (error) {
    console.log(error);
    res.send({
      title: '¡Error al borrar!', 
      message: error.errors.estado.message, 
      status: 'error'
    });
  }
}

capituloCtrl.getCapitulosXNovelas = async (req, res) => {
  const capitulos = await Capitulo.find({id_novela: req.params.id}).sort({numero:-1});
  res.json(capitulos)
}

capituloCtrl.BusquedaXNumero = async (req, res) => {
  if (req.query.idNovela) {
    try {
      await Capitulo.find( {id_novela: req.query.idNovela , numero: req.query.var},
        function(err, docs) {
          if(!err) res.send(docs)
      });
    } catch (error) {
      await Capitulo.find( {id_novela: req.query.idNovela, traductor: new RegExp(req.params.var, "i")},
      function(err, docs) {
        if(!err) {
          res.send(docs)
        } else {
          res.send("404");
          console.log(err);
        };
      }).sort({numero:-1});
    }
  } else {
    try {
      await Capitulo.find( {numero: req.query.var},
        function(err, docs) {
          if(!err) res.send(docs)
      });
    } catch (error) {
      await Capitulo.find( {traductor: new RegExp(req.params.var, "i")},
      function(err, docs) {
        if(!err) {
          res.send(docs)
        } else {
          res.send("404");
          console.log(err);
        };
      }).sort({numero:-1});
    }
  }
}

module.exports = capituloCtrl;