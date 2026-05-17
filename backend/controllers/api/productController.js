const mongoose       = require('mongoose');
const productService = require('../../services/productService');

const FIELD_MAP = {
  name: 'nombre', description: 'descripcion', price: 'precio',
  imageUrl: 'imagen', stock: 'stock'
};

function toApi(p) {
  const imagen = p.imagen ?? '';
  const imageUrl = imagen && !imagen.startsWith('http') ? `/uploads/${imagen}` : imagen;
  return {
    id:          p._id,
    name:        p.nombre,
    description: p.descripcion ?? '',
    price:       p.precio,
    imageUrl,
    categoryId:  p.categoria ?? null,
    stock:       p.stock ?? 0
  };
}

function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function validateBody(body, { partial = false } = {}) {
  const { name, price, categoryId, stock, description, imageUrl } = body;
  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '')
      return 'name es obligatorio y debe ser una cadena no vacía';
  }
  if (!partial || price !== undefined) {
    if (price === undefined || price === null) return 'price es obligatorio';
    if (typeof price !== 'number' || !isFinite(price) || price <= 0)
      return 'price debe ser un número mayor a 0';
  }
  if (categoryId !== undefined && categoryId !== null && !isValidId(categoryId))
    return 'categoryId inválido';
  if (stock !== undefined && (!Number.isInteger(stock) || stock < 0))
    return 'stock debe ser un entero no negativo';
  if (description !== undefined && typeof description !== 'string')
    return 'description debe ser una cadena';
  if (imageUrl !== undefined && typeof imageUrl !== 'string')
    return 'imageUrl debe ser una cadena';
  return null;
}

exports.getAll = async (req, res, next) => {
  try {
    const { categoryId, q } = req.query;
    if (categoryId !== undefined && !isValidId(categoryId))
      return res.status(400).json({ error: 'categoryId inválido' });
    const productos = await productService.findAll({ categoryId, q });
    res.json(productos.map(toApi));
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Producto no encontrado' });
    const producto = await productService.findById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(toApi(producto));
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ error });
    const { name, description, price, imageUrl, stock, categoryId } = req.body;
    if (categoryId && !await productService.categoryExists(categoryId))
      return res.status(400).json({ error: 'La categoría seleccionada no es válida' });
    const producto = await productService.create({
      nombre:      name.trim(),
      descripcion: description ? String(description).trim() : '',
      precio:      price,
      imagen:      imageUrl ? String(imageUrl).trim() : '',
      categoria:   categoryId || null,
      stock:       stock ?? 0
    });
    res.status(201).json(toApi(producto));
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Producto no encontrado' });
    const error = validateBody(req.body);
    if (error) return res.status(400).json({ error });
    const { name, description, price, imageUrl, stock, categoryId } = req.body;
    if (categoryId && !await productService.categoryExists(categoryId))
      return res.status(400).json({ error: 'La categoría seleccionada no es válida' });
    const producto = await productService.update(req.params.id, {
      nombre:      name.trim(),
      descripcion: description ? String(description).trim() : '',
      precio:      price,
      imagen:      imageUrl ? String(imageUrl).trim() : '',
      categoria:   categoryId || null,
      stock:       stock ?? 0
    });
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(toApi(producto));
  } catch (err) { next(err); }
};

exports.patch = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Producto no encontrado' });
    const error = validateBody(req.body, { partial: true });
    if (error) return res.status(400).json({ error });
    const updates = {};
    for (const [apiKey, dbKey] of Object.entries(FIELD_MAP)) {
      if (req.body[apiKey] !== undefined)
        updates[dbKey] = typeof req.body[apiKey] === 'string' ? req.body[apiKey].trim() : req.body[apiKey];
    }
    if (req.body.categoryId !== undefined) {
      if (req.body.categoryId) {
        if (!await productService.categoryExists(req.body.categoryId))
          return res.status(400).json({ error: 'La categoría seleccionada no es válida' });
        updates.categoria = req.body.categoryId;
      } else {
        updates.categoria = null;
      }
    }
    const producto = await productService.patch(req.params.id, updates);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(toApi(producto));
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    if (!isValidId(req.params.id)) return res.status(404).json({ error: 'Producto no encontrado' });
    const deleted = await productService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (err) { next(err); }
};
