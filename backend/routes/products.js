const { Router } = require('express')
const { readDB, writeDB, nextId } = require('../lib/db')
const { encodeProductId, decodeProductId, encodeCategoryId, decodeCategoryId } = require('../lib/hashids')

const router = Router()

function encodeProduct(p) {
  return { ...p, id: encodeProductId(p.id), categoryId: encodeCategoryId(p.categoryId) }
}

// categoryId in request body is an encoded string — only structural check here.
// Existence + decode validation happens inside each route handler.
function validateProduct(body, { partial = false } = {}) {
  const { name, price, categoryId, stock, description, imageUrl } = body

  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return 'name es obligatorio y debe ser una cadena no vacía'
    }
  }
  if (!partial || price !== undefined) {
    if (price === undefined || price === null) return 'price es obligatorio'
    if (typeof price !== 'number' || !isFinite(price) || price <= 0) {
      return 'price debe ser un número mayor a 0'
    }
  }
  if (!partial || categoryId !== undefined) {
    if (!categoryId || typeof categoryId !== 'string') {
      return 'categoryId es obligatorio'
    }
  }
  if (stock !== undefined) {
    if (!Number.isInteger(stock) || stock < 0) {
      return 'stock debe ser un entero no negativo'
    }
  }
  if (description !== undefined && typeof description !== 'string') {
    return 'description debe ser una cadena'
  }
  if (imageUrl !== undefined && typeof imageUrl !== 'string') {
    return 'imageUrl debe ser una cadena'
  }
  return null
}

router.get('/', (req, res, next) => {
  try {
    let { products } = readDB()
    const { categoryId, q } = req.query

    if (categoryId !== undefined) {
      const numId = decodeCategoryId(categoryId)
      if (!numId) return res.status(400).json({ error: 'categoryId inválido' })
      products = products.filter(p => p.categoryId === numId)
    }

    if (q !== undefined) {
      const term = q.trim().toLowerCase()
      if (term.length > 0) {
        products = products.filter(p =>
          p.name.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term)
        )
      }
    }

    res.json(products.map(encodeProduct))
  } catch (err) {
    next(err)
  }
})

router.get('/:id', (req, res, next) => {
  try {
    const numId = decodeProductId(req.params.id)
    if (!numId) return res.status(404).json({ error: 'Producto no encontrado' })

    const { products } = readDB()
    const product = products.find(p => p.id === numId)
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' })

    res.json(encodeProduct(product))
  } catch (err) {
    next(err)
  }
})

router.post('/', (req, res, next) => {
  try {
    const validationError = validateProduct(req.body)
    if (validationError) return res.status(400).json({ error: validationError })

    const { name, description, price, imageUrl, stock } = req.body
    const numCategoryId = decodeCategoryId(req.body.categoryId)
    const db = readDB()

    if (!numCategoryId || !db.categories.some(c => c.id === numCategoryId)) {
      return res.status(400).json({ error: 'La categoría seleccionada no es válida' })
    }

    const newProduct = {
      id: nextId(db.products),
      name: name.trim(),
      description: description != null ? String(description).trim() : '',
      price,
      imageUrl: imageUrl != null ? String(imageUrl).trim() : '',
      categoryId: numCategoryId,
      stock: stock ?? 0
    }

    db.products.push(newProduct)
    writeDB(db)
    res.status(201).json(encodeProduct(newProduct))
  } catch (err) {
    next(err)
  }
})

router.put('/:id', (req, res, next) => {
  try {
    const validationError = validateProduct(req.body)
    if (validationError) return res.status(400).json({ error: validationError })

    const numId = decodeProductId(req.params.id)
    if (!numId) return res.status(404).json({ error: 'Producto no encontrado' })

    const { name, description, price, imageUrl, stock } = req.body
    const numCategoryId = decodeCategoryId(req.body.categoryId)
    const db = readDB()

    const index = db.products.findIndex(p => p.id === numId)
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

    if (!numCategoryId || !db.categories.some(c => c.id === numCategoryId)) {
      return res.status(400).json({ error: 'La categoría seleccionada no es válida' })
    }

    db.products[index] = {
      id: db.products[index].id,
      name: name.trim(),
      description: description != null ? String(description).trim() : '',
      price,
      imageUrl: imageUrl != null ? String(imageUrl).trim() : '',
      categoryId: numCategoryId,
      stock: stock ?? 0
    }

    writeDB(db)
    res.json(encodeProduct(db.products[index]))
  } catch (err) {
    next(err)
  }
})

router.patch('/:id', (req, res, next) => {
  try {
    const validationError = validateProduct(req.body, { partial: true })
    if (validationError) return res.status(400).json({ error: validationError })

    const numId = decodeProductId(req.params.id)
    if (!numId) return res.status(404).json({ error: 'Producto no encontrado' })

    const db = readDB()
    const index = db.products.findIndex(p => p.id === numId)
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

    const ALLOWED = ['name', 'description', 'price', 'imageUrl', 'stock']
    const updates = {}
    for (const key of ALLOWED) {
      if (req.body[key] !== undefined) {
        updates[key] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key]
      }
    }

    if (req.body.categoryId !== undefined) {
      const numCategoryId = decodeCategoryId(req.body.categoryId)
      if (!numCategoryId || !db.categories.some(c => c.id === numCategoryId)) {
        return res.status(400).json({ error: 'La categoría seleccionada no es válida' })
      }
      updates.categoryId = numCategoryId
    }

    db.products[index] = { ...db.products[index], ...updates }
    writeDB(db)
    res.json(encodeProduct(db.products[index]))
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', (req, res, next) => {
  try {
    const numId = decodeProductId(req.params.id)
    if (!numId) return res.status(404).json({ error: 'Producto no encontrado' })

    const db = readDB()
    const index = db.products.findIndex(p => p.id === numId)
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

    db.products.splice(index, 1)
    writeDB(db)
    res.status(204).send()
  } catch (err) {
    next(err)
  }
})

module.exports = router
