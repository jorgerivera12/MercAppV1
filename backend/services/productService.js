const Producto  = require('../models/Producto');
const Categoria = require('../models/Categoria');

exports.findAll = async ({ categoryId, q } = {}) => {
  const filter = {};
  if (categoryId) filter.categoria = categoryId;

  let productos = await Producto.find(filter).lean().sort({ createdAt: -1 });

  if (q && q.trim().length > 0) {
    const term = q.trim().toLowerCase();
    productos = productos.filter(p =>
      p.nombre.toLowerCase().includes(term) ||
      (p.descripcion && p.descripcion.toLowerCase().includes(term))
    );
  }
  return productos;
};

exports.findById = async (id) => Producto.findById(id).lean();

exports.create = async (data) => Producto.create(data);

exports.update = async (id, data) =>
  Producto.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();

exports.patch = async (id, updates) =>
  Producto.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();

exports.remove = async (id) => Producto.findByIdAndDelete(id);

exports.categoryExists = async (id) => Categoria.exists({ _id: id });

exports.getDashboardStats = async () => {
  const [totalProductos, productos] = await Promise.all([
    Producto.countDocuments(),
    Producto.find().lean().sort({ createdAt: -1 }).limit(5)
  ]);
  const result = await Producto.aggregate([
    { $group: { _id: null, total: { $sum: '$precio' } } }
  ]);
  return {
    totalProductos,
    valorInventario: result[0]?.total || 0,
    productos
  };
};
