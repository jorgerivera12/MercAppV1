// Inicialización perezosa: no ocupa espacio en sesión hasta el primer ítem
exports.getSessionCart = (session) => {
  if (!session.cart) session.cart = {};
  return session.cart;
};

// toFixed(2) redondea al centavo; Number() evita devolver una cadena en la respuesta
exports.buildResponse = (cart) => {
  const items = Object.values(cart);
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  return { items, total: Number(total.toFixed(2)) };
};

exports.addItem = (cart, key, apiProduct, quantity) => {
  if (cart[key]) {
    cart[key].quantity += quantity;
  } else {
    cart[key] = { product: apiProduct, quantity };
  }
  return cart[key];
};

exports.updateItem = (cart, productId, quantity) => {
  cart[productId].quantity = quantity;
  return cart[productId];
};

exports.removeItem = (cart, key) => {
  delete cart[key];
};

exports.clear = (session) => {
  session.cart = {};
};
