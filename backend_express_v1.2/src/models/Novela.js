const { Schema, model, plugin } = require('mongoose');
var slug = require('mongoose-slug-updater');
plugin(slug);

//importar sub documentos
const Capitulo = require('./Capitulo');
const Imagen = require('./Imagen');

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
  estado: {
    required: true,
    type: String,
    trim: true
  },
  tipo: {
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
    default: []
  },
  clasificacion: {
    type: Array,
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
  uploadedBy: {
    required: true,
    type: Object,
    nombre: String,
    url: String
  },
  capitulos: [Capitulo],
  imagenes: [Imagen]
}, 
{
  timestamps: true
});


module.exports = model('Novela', novelaSchema);