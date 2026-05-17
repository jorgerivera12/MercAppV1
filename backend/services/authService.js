const Usuario = require('../models/Usuario');

exports.findByEmail = async (email) => Usuario.findOne({ email });

exports.create = async (data) => Usuario.create(data);

// Retorna documento Mongoose (no lean) para poder llamar compararPassword() y save()
exports.findById = async (id) => Usuario.findById(id);
