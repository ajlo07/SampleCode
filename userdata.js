const mongoose = require('mongoose');

const dataschema = new mongoose.Schema({
    name: String,
    age: String,
    city: String
});

module.exports =  mongoose.model('node', dataschema);
