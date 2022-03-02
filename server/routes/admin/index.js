const AdminUser = require('../../models/AdminUser')
const jwt = require('jsonwebtoken')
// http-assert
const assert = require('http-assert')

module.exports = app => {
  const express = require('express')
  const router = express.Router({
    // 把父级的url参数合并到router里面的路由
    mergeParams: true
  })

  // 创建资源
  router.post('/', async (req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 更新资源
  router.put('/:id', async (req, res) => {
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除资源
  router.delete('/:id', async (req, res) => {
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })
  // 资源列表
  router.get('/', async (req, res) => {
    // populate:关联查询，由字符串_id变成一个完整的对象
    // const items = await req.Model.find().populate('parent').limit(10)
    const queryOptions = {}
    if (req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(100)
    res.send(items)
  })
  // 资源详情
  router.get('/:id', async (req, res) => {
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 登录校验中间件
  const authMiddleware = require('../../middleware/auth')
  // 获取model中间件
  const resourceMiddleware = require('../../middleware/resource')

  // 调用接口时，先判断用户是否登录，再执行请求函数获取对应model，再next到达router
  app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

  // 调用接口上传图片 multer
  const multer = require('multer')
  // 上传中间件
  // dest: 目标地址  __dirname: 绝对地址(....../index.js + /admin/routes/uploads)
  const upload = multer({ dest: __dirname + '/../../uploads' })
  // upload.single:接收单个文件上传   file: 接口字段名
  app.post('/admin/api/upload', authMiddleware(), upload.single('file'), async (req, res) => {
    const file = req.file
    file.url = `http://localhost:3000/uploads/${file.filename}`
    res.send(file)
  })

  // 登录
  app.post('/admin/api/login', async (req, res) => {
    const { username, password } = req.body
    // 根据用户名找用户
    const user = await AdminUser.findOne({
      // username: username
      username
    }).select('+password')  //select: false  // + 被强制选择
    assert(user, 422, '用户不存在')
    // if(!user) {
    //   return res.status(422).send({
    //     message: '用户不存在'
    //   })
    // }
    // 校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    assert(isValid, 422, '密码错误')
    // if (!isValid) {
    //   return res.status(422).send({
    //     message: '密码错误'
    //   })
    // }
    // 返回token
    // jsonwebtoken
    const token = jwt.sign({
      id: user._id
    }, app.get('secret'))
    res.send({ token })
  })

  // 错误处理
  app.use(async (err, req, res, next) => {
    // console.log(err);
    res.status(err.statusCode || 500).send({
      message: err.message
    })
  })
}