const { Schema, model } = require('mongoose');

const novelaSchema = new Schema({
    titulo: String,
    contenido: {
        type: String,
        required: true
    },
    autor: String,
}, {
    timestamps: true
});

module.exports = model('Novela', novelaSchema);