const { validationResult } = require('express-validator');
const productService = require('../../services/productService');

exports.listar = async (req, res) => {
  const productos = await productService.findAll({});
  res.render('productos/lista', { title: 'Productos', productos });
};

exports.formNuevo = (req, res) => {
  res.render('productos/nuevo', { title: 'Nuevo Producto' });
};

exports.crear = async (req, res) => {
  if (req.uploadError) {
    return res.render('productos/nuevo', {
      title: 'Nuevo Producto',
      errores: [{ msg: req.uploadError }],
      body: req.body
    });
  }
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.render('productos/nuevo', {
      title: 'Nuevo Producto',
      errores: errores.array(),
      body: req.body
    });
  }
  const { nombre, descripcion, precio } = req.body;
  const imagen = req.file ? req.file.filename : '';
  await productService.create({ nombre, descripcion, precio, imagen });
  res.redirect('/productos');
};

exports.formEditar = async (req, res) => {
  const producto = await productService.findById(req.params.id);
  if (!producto) return res.redirect('/productos');
  res.render('productos/editar', { title: 'Editar Producto', producto });
};

exports.actualizar = async (req, res) => {
  if (req.uploadError) {
    const producto = await productService.findById(req.params.id);
    return res.render('productos/editar', {
      title: 'Editar Producto',
      producto,
      errores: [{ msg: req.uploadError }]
    });
  }
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    const producto = await productService.findById(req.params.id);
    return res.render('productos/editar', {
      title: 'Editar Producto',
      producto,
      errores: errores.array()
    });
  }
  const { nombre, descripcion, precio } = req.body;
  const data = { nombre, descripcion, precio };
  if (req.file) data.imagen = req.file.filename;
  await productService.update(req.params.id, data);
  res.redirect('/productos');
};

exports.eliminar = async (req, res) => {
  await productService.remove(req.params.id);
  res.redirect('/productos');
};
