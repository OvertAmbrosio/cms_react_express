const { Schema, model, plugin } = require('mongoose');
var slug = require('mongoose-slug-updater');
plugin(slug);

const novelaSchema = new Schema({
  titulo: {
    type: String,
    trim: true,
  },
  slug: {
    type: String,
    slug: "titulo"
  },
  acron: {
    type: String,
    uppercase: true,
    trim: true
  },
  titulo_alt: {
    type: String,
    trim: true,
  },
  autor: {
    type: String,
    trim: true
  },
  sinopsis: String,
  tipo: {
    type: String,
    trim: true
  },
  estado: {
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
  imagen_portada: {
    titulo: String,
    url: String,
    public_id:String
  },
  imagen_mini: {
    titulo: String,
    url: String,
    public_id:String
  },
  createdBy: {
    type: String
  }
}, 
{
  timestamps: true
});


module.exports = model('Novela', novelaSchema);