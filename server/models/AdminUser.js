const mongoose = require('mongoose')

// 创建Schema对象（约束）
const schema = new mongoose.Schema({
  username: String,
  password: { 
    type: String, 
    select: false,
    // bcrypt
    set(val) {
      return require('bcrypt').hashSync(val, 10)
    } 
  }
})

// 将schema映射到一个MongoDB collection并定义这个文档的构成
module.exports = mongoose.model('AdminUser', schema)