const { Schema, model } = require('mongoose');

const capituloSchema = new Schema({
  contenido: {
    required: true,
    type: String
  },

  traductor: {
    required: true,
    type: Object,
    nombre: String,
    url: String
  },

  nota:{
    type: String,
    trim: true,
  },

  tipo: {
    type: String,
    required: true,
    default: "Sugerencia"
  }
},
{
  timestamps: true
});

module.exports = ('Capitulo', capituloSchema);