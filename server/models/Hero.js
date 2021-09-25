const mongoose = require('mongoose')

// 创建Schema对象（约束）
const schema = new mongoose.Schema({
  name: String,
  avatar: String,
  banner: String,
  title: String,
  // 类型
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
  // 评分
  scores: {
    difficult: { type: Number },
    skills: { type: Number },
    attack: { type: Number },
    survive: { type: Number }
  },
  // 技能
  skills: [{
    icon: String,
    name: String,
    delay: String,
    cost: String,
    description: String,
    tips: String
  }],
  // 顺风/逆风出装
  items1: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  items2: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
  // 使用技巧
  usageTips: String,
  // 对抗技巧
  battleTips: String,
  // 团队思路
  teamTips: String,
  // 英雄关系 搭档
  partners: [{
    hero: { type: mongoose.Schema.Types.ObjectId, ref: 'Hero' },
    description: String
  }]
})

// 将schema映射到一个MongoDB collection并定义这个文档的构成
module.exports = mongoose.model('Hero', schema)