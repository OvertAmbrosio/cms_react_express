const { Schema } = require('mongoose');

const imagenSchema = new Schema({
  titulo: {
    type: String,
    trim: true,
    unique: true
  },
  tipo: {
    type: String,
    trim: true,
    required: true
  },
  contentType:{
    type: String,
    trim: true,
    required: true
  },
  url: {
    type: String,
    trim: true,
    required: true,
  },
  key: {
    trim: true,
    type: String,
    required: true
  }
},
{
  timestamps: true
});

module.exports = ('Imagen', imagenSchema);