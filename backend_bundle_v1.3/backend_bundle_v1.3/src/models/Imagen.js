const { Schema, model } = require('mongoose');

const imagenSchema = new Schema({
  id_novela: {
    type: Schema.Types.ObjectId, 
    ref: 'Novela',
    required: true
  },
  titulo: {
    type: String,
    trim: true
  },
  tipo: {
    type: String,
    trim: true
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

module.exports = model('Imagen', imagenSchema);