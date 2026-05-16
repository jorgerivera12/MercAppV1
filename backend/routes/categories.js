const { Router } = require('express')
const { readDB } = require('../lib/db')
const { encodeCategoryId } = require('../lib/hashids')

const router = Router()

router.get('/', (req, res, next) => {
  try {
    const { categories } = readDB()
    res.json(categories.map(c => ({ ...c, id: encodeCategoryId(c.id) })))
  } catch (err) {
    next(err)
  }
})

module.exports = router
