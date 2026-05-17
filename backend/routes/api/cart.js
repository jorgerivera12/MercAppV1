const { Router } = require('express');
const ctrl = require('../../controllers/api/cartController');

const router = Router();

router.get('/',                    ctrl.getCart);
router.post('/items',              ctrl.addItem);
router.put('/items/:productId',    ctrl.updateItem);
router.delete('/items/:productId', ctrl.removeItem);
router.delete('/',                 ctrl.clearCart);

module.exports = router;
