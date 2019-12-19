const { Schema } = require('mongoose');

//importar sub documentos
const CapituloContenido = require('./CapituloContenido');

const capituloSchema = new Schema({
  titulo: {
    type: String,
    trim: true,
    required: true
  },

  numero: {
    type: Number,
    required: true
  },

  estado: {
    type: String,
    required: true
  },

  contenido: [CapituloContenido],

  slug:{
    type: String,
    trim: true,
    lowercase: true
  }
},
{
  timestamps: true
});

module.exports = ('Capitulo', capituloSchema);