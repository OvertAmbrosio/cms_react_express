const { Schema, model } = require('mongoose');

const contenidoSchema = new Schema({
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
    default: "Secundario"
  }
},
{
  timestamps: true
});

module.exports = model('Contenido', contenidoSchema);