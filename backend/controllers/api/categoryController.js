const Categoria = require('../../models/Categoria');

function toApi(c) {
  return { id: c._id, name: c.nombre };
}

exports.getAll = async (req, res, next) => {
  try {
    const categorias = await Categoria.find().lean().sort({ nombre: 1 });
    res.json(categorias.map(toApi));
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ error: 'name es obligatorio' });
    }
    const categoria = await Categoria.create({ nombre: name.trim() });
    res.status(201).json(toApi(categoria));
  } catch (err) {
    // 11000 es el código de error de índice único duplicado en MongoDB
    if (err.code === 11000) return res.status(400).json({ error: 'Ya existe una categoría con ese nombre' });
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Categoria.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
