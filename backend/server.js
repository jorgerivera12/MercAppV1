const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3000
const DB_PATH = path.join(__dirname, 'data', 'db.json')

app.use(express.json())

// --- helpers ---

function readDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'))
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

function nextId(items) {
  return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1
}

// --- categories ---

app.get('/api/categories', (req, res) => {
  const { categories } = readDB()
  res.json(categories)
})

// --- products ---

app.get('/api/products', (req, res) => {
  const { products } = readDB()
  res.json(products)
})

app.get('/api/products/:id', (req, res) => {
  const { products } = readDB()
  const product = products.find(p => p.id === Number(req.params.id))
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' })
  res.json(product)
})

app.post('/api/products', (req, res) => {
  const { name, description, price, imageUrl, categoryId, stock } = req.body

  if (!name || price === undefined || !categoryId) {
    return res.status(400).json({ error: 'name, price y categoryId son obligatorios' })
  }

  const db = readDB()
  const newProduct = {
    id: nextId(db.products),
    name,
    description: description ?? '',
    price: Number(price),
    imageUrl: imageUrl ?? '',
    categoryId: Number(categoryId),
    stock: stock !== undefined ? Number(stock) : 0
  }

  db.products.push(newProduct)
  writeDB(db)
  res.status(201).json(newProduct)
})

app.put('/api/products/:id', (req, res) => {
  const db = readDB()
  const index = db.products.findIndex(p => p.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

  const { name, description, price, imageUrl, categoryId, stock } = req.body

  if (!name || price === undefined || !categoryId) {
    return res.status(400).json({ error: 'name, price y categoryId son obligatorios' })
  }

  db.products[index] = {
    id: db.products[index].id,
    name,
    description: description ?? '',
    price: Number(price),
    imageUrl: imageUrl ?? '',
    categoryId: Number(categoryId),
    stock: stock !== undefined ? Number(stock) : 0
  }

  writeDB(db)
  res.json(db.products[index])
})

app.patch('/api/products/:id', (req, res) => {
  const db = readDB()
  const index = db.products.findIndex(p => p.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

  db.products[index] = { ...db.products[index], ...req.body, id: db.products[index].id }
  writeDB(db)
  res.json(db.products[index])
})

app.delete('/api/products/:id', (req, res) => {
  const db = readDB()
  const index = db.products.findIndex(p => p.id === Number(req.params.id))
  if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' })

  db.products.splice(index, 1)
  writeDB(db)
  res.status(204).send()
})

// --- start ---

app.listen(PORT, () => {
  console.log(`MercApp API corriendo en http://localhost:${PORT}`)
})
