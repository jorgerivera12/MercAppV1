const { Router } = require('express');
const ctrl = require('../../controllers/api/categoryController');

const router = Router();

router.get('/',      ctrl.getAll);
router.post('/',     ctrl.create);
router.delete('/:id', ctrl.remove);

module.exports = router;
