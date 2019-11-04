const { Schema, model } = require('mongoose');

const capituloSchema = new Schema({
  id_novela: {
    type: Schema.Types.ObjectId, 
    ref: 'novelas',
    required: true
  },

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

  nota:{
    type: String,
    trim: true,
  },

  contenido: {
    type: String,
    required: true
  },

  traductor: String,

  slug:{
    type: String,
    trim: true,
    lowercase: true
  }
},
{
  timestamps: true
});

module.exports = model('Capitulo', capituloSchema);