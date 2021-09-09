const mongoose = require('mongoose')

// 创建Schema对象（约束）
const schema = new mongoose.Schema({
  name: String,
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
})

// 将schema映射到一个MongoDB collection并定义这个文档的构成
module.exports = mongoose.model('Category', schema)