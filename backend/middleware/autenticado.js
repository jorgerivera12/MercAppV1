// Guard de ruta: redirige al login si no existe una sesión autenticada
module.exports = (req, res, next) => {
  if (req.session.usuarioId) return next();
  res.redirect('/login');
};
