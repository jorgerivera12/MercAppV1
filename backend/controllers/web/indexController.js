const Producto = require('../../models/Producto');
const Usuario  = require('../../models/Usuario');

exports.index = async (req, res) => {
  // Ambas consultas corren en paralelo para reducir el tiempo de carga del dashboard
  const [totalProductos, productos] = await Promise.all([
    Producto.countDocuments(),
    Producto.find().lean().sort({ createdAt: -1 }).limit(5)
  ]);
  // Delegar la suma a MongoDB es más eficiente que recorrer todos los documentos en JS
  const valorInventario = await Producto.aggregate([
    { $group: { _id: null, total: { $sum: '$precio' } } }
  ]);
  res.render('index', {
    title: 'Dashboard',
    totalProductos,
    valorInventario: valorInventario[0]?.total || 0,
    productos
  });
};

exports.perfil = async (req, res) => {
  const usuario = await Usuario.findById(req.session.usuarioId).lean();
  res.render('perfil', { title: 'Mi perfil', usuario });
};

exports.actualizarPassword = async (req, res) => {
  const { actual, nueva, confirmar } = req.body;
  const usuario = await Usuario.findById(req.session.usuarioId);

  // Closure local para no repetir la llamada a render con el contexto de error
  const renderError = (msg) =>
    res.render('perfil', { title: 'Mi perfil', usuario: usuario.toObject(), passError: msg });

  // Verificar contraseña actual
  const valido = await usuario.compararPassword(actual);
  if (!valido) return renderError('La contraseña actual es incorrecta.');

  // Validar nueva contraseña
  if (nueva.length < 6) return renderError('La nueva contraseña debe tener mínimo 6 caracteres.');
  if (nueva !== confirmar) return renderError('Las contraseñas nuevas no coinciden.');

  usuario.password = nueva;
  await usuario.save();

  res.render('perfil', { title: 'Mi perfil', usuario: usuario.toObject(), passOk: true });
};
