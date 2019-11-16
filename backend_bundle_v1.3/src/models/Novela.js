const { Schema, model, plugin } = require('mongoose');
var slug = require('mongoose-slug-updater');
plugin(slug);

const novelaSchema = new Schema({
  titulo: {
    required: true,
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    slug: "titulo"
  },
  acron: {
    required: true,
    type: String,
    uppercase: true,
    trim: true
  },
  titulo_alt: {
    required: true,
    type: String,
    trim: true,
  },
  autor: {
    required: true,
    type: String,
    trim: true
  },
  sinopsis: String,
  tipo: {
    required: true,
    type: String,
    trim: true
  },
  estado: {
    required: true,
    type: String,
    trim: true
  },
  categorias: {
    type: Array,
    trim: true,
    default: []
  },
  etiquetas: {
    type: Array,
    trim: true,
    lowercase: true,
    default: []
  },
  clasificacion: {
    puntaje: {
      type: Number,
      min: 1,
      max: 5
    },
    usuario: {
      type: Schema.ObjectId,
      ref: 'Usuario'
    }
  },
  createdBy: {
    required: true,
    type: String
  }
}, 
{
  timestamps: true
});


module.exports = model('Novela', novelaSchema);