const Categoria = require('../models/Categoria');

exports.findAll = async () => Categoria.find().lean().sort({ nombre: 1 });

exports.create = async (name) => Categoria.create({ nombre: name.trim() });

exports.remove = async (id) => Categoria.findByIdAndDelete(id);
