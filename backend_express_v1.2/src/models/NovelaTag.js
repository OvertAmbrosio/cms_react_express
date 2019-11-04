const { Schema, model, plugin } = require('mongoose');
var slug = require('mongoose-slug-updater');
plugin(slug);


const etiquetasSchema = new Schema({
  text: String,
  slug: {
    type: String,
    slug: "text"
  },
});

module.exports = model('Etiquetas', etiquetasSchema);