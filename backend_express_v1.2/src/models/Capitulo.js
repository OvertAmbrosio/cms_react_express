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

  slug:{
    type: String,
    trim: true,
    lowercase: true
  },

  contenido: [{
    type: Schema.Types.ObjectId,
    ref: 'Contenido'
  }],
},
{
  timestamps: true
});

module.exports = ('Capitulo', capituloSchema);