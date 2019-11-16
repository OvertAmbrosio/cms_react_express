const { Schema, model } = require('mongoose');

const nTipoSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  descripcion: String
});

module.exports = model('NovelaTipo', nTipoSchema);