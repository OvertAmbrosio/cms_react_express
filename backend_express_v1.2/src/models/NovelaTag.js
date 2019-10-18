const { Schema, model } = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');

const etiquetasSchema = new Schema({
  text: String
});

etiquetasSchema.plugin(URLSlugs('text', {field: 'id'}));

module.exports = model('Etiquetas', etiquetasSchema);