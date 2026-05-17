const { Router } = require('express');
const ctrl = require('../../controllers/api/productController');

const router = Router();

router.get('/',      ctrl.getAll);
router.get('/:id',   ctrl.getOne);
router.post('/',     ctrl.create);
router.put('/:id',   ctrl.update);
router.patch('/:id', ctrl.patch);
router.delete('/:id', ctrl.remove);

module.exports = router;
