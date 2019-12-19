const { Schema, model } = require('mongoose');

const nCateSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  descripcion: String
});

const etiquetasSchema = new Schema({
  text: String,
  slug: {
    type: String,
    trim: true
  },
});

const nTiposSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  slug: {
    type: String,
    trim: true
  },
  descripcion: String
});

const NovelaUtil = new Schema({
  categorias: [nCateSchema],
  etiquetas: [etiquetasSchema],
  tipos: [nTiposSchema]
});

module.exports = model('NovelaUtil', NovelaUtil);