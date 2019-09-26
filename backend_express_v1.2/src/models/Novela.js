const { Schema, model } = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const novelaSchema = new Schema({
  titulo: {
    type: String,
    trim: true,
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
    type: Schema.ObjectId, 
    ref: 'NovelaTipo'
  },
  estado: {
    type: String,
    trim: true
  },
  categoria: [
    {
      type: Schema.ObjectId,
      ref: 'NovelasCate'
    }
  ],
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
      ref: 'Usuario',
      unique: true
    }
  }
}, 
{
  timestamps: true
});

novelaSchema.plugin(URLSlugs('titulo', {field: 'slug'}));

module.exports = model('Novela', novelaSchema);