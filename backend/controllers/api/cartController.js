const mongoose       = require('mongoose');
const cartService    = require('../../services/cartService');
const productService = require('../../services/productService');

exports.getCart = (req, res) => {
  const cart = cartService.getSessionCart(req.session);
  res.json(cartService.buildResponse(cart));
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId))
      return res.status(400).json({ error: 'productId debe ser un ObjectId válido' });
    if (!Number.isInteger(quantity) || quantity <= 0)
      return res.status(400).json({ error: 'quantity debe ser un entero mayor a 0' });

    const producto = await productService.findById(productId);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });

    const cart = cartService.getSessionCart(req.session);
    const apiProduct = {
      id:          producto._id,
      name:        producto.nombre,
      description: producto.descripcion ?? '',
      price:       producto.precio,
      imageUrl:    producto.imagen ?? '',
      categoryId:  producto.categoria ?? null,
      stock:       producto.stock ?? 0
    };
    const item = cartService.addItem(cart, String(productId), apiProduct, quantity);
    res.status(201).json(item);
  } catch (err) { next(err); }
};

exports.updateItem = (req, res) => {
  const { productId } = req.params;
  const { quantity }  = req.body;
  const cart = cartService.getSessionCart(req.session);
  if (!cart[productId]) return res.status(404).json({ error: 'Producto no está en el carrito' });
  if (!Number.isInteger(quantity) || quantity <= 0)
    return res.status(400).json({ error: 'quantity debe ser un entero mayor a 0' });
  res.json(cartService.updateItem(cart, productId, quantity));
};

exports.removeItem = (req, res) => {
  const cart = cartService.getSessionCart(req.session);
  const key  = req.params.productId;
  if (!cart[key]) return res.status(404).json({ error: 'Producto no está en el carrito' });
  cartService.removeItem(cart, key);
  res.status(204).send();
};

exports.clearCart = (req, res) => {
  cartService.clear(req.session);
  res.status(204).send();
};
