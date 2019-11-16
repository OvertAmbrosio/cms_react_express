const { Schema, model } = require('mongoose');

const nCateSchema = new Schema({
  nombre: {
    type: String,
    trim: true
  },
  descripcion: String
});

module.exports = model('NovelaCate', nCateSchema);