const Hashids = require('hashids/cjs')

const SALT = process.env.HASH_SALT || 'mA_7xRz_sEcRet_s4lt_2024!'

const productIds  = new Hashids(`p-${SALT}`, 6)
const categoryIds = new Hashids(`c-${SALT}`, 6)

function encodeProductId(id)   { return productIds.encode(id) }
function decodeProductId(hash) { const r = productIds.decode(hash);  return r.length === 1 ? Number(r[0]) : null }

function encodeCategoryId(id)   { return categoryIds.encode(id) }
function decodeCategoryId(hash) { const r = categoryIds.decode(hash); return r.length === 1 ? Number(r[0]) : null }

module.exports = { encodeProductId, decodeProductId, encodeCategoryId, decodeCategoryId }
