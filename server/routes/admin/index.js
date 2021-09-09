const AdminUser = require('../../models/AdminUser')
const jwt = require('jsonwebtoken')

module.exports = app => {
  const express = require('express')
  const router = express.Router({
    // 把父级的url参数合并到router里面的路由
    mergeParams: true
  })
  
  // 创建资源
  router.post('/', async(req, res) => {
    const model = await req.Model.create(req.body)
    res.send(model)
  })
  // 更新资源
  router.put('/:id', async(req, res) => { 
    const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  // 删除资源
  router.delete('/:id', async(req, res) => { 
    await req.Model.findByIdAndDelete(req.params.id, req.body)
    res.send({
      success: true
    })
  })
  // 资源列表
  router.get('/', async(req, res, next) => {
    // 获取token并去除'Bearer '
    const token = String(req.headers.authorization || '').split(' ').pop()
    // 验证解析token { id: '61385e2067ed16ed8af881c0', iat: 1631089410 }
    const { id } = jwt.verify(token, app.get('secret'))
    req.user = await AdminUser.findById(id)
    console.log(req.user);
    // console.log(tokenData);
    // console.log(token);
    await next()
  }, async(req, res) => {
    // const items = await req.Model.find().populate('parent').limit(10)
    const queryOptions = {}
    if(req.Model.modelName === 'Category') {
      queryOptions.populate = 'parent'
    }
    const items = await req.Model.find().setOptions(queryOptions).limit(10)
    res.send(items)
  })
  // 资源详情
  router.get('/:id', async(req, res) => {   
    const model = await req.Model.findById(req.params.id)
    res.send(model)
  })

  // 调用接口时，先执行请求函数进行处理，再next到达router
  app.use('/admin/api/rest/:resource', async(req, res, next) => {  //中间件
    // 将categoris 转换成 Category
    const modelName = require('inflection').classify(req.params.resource)
    req.Model = require(`../../models/${modelName}`)
    next()
  }, router)

  // 调用接口上传图片 multer
  const multer = require('multer')
  // 上传中间件
  // dest: 目标地址  __dirname: 绝对地址(....../index.js + /admin/routes/uploads)
  const upload = multer({dest: __dirname + '/../../uploads'})
  // upload.single:接收单个文件上传   file: 接口字段名
  app.post('/admin/api/upload', upload.single('file'), async (req, res) => {
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
    }).select('+password')  //select: false
    if(!user) {
      return res.status(422).send({
        message: '用户不存在'
      })
    }
    // 校验密码
    const isValid = require('bcrypt').compareSync(password, user.password)
    if(!isValid) {
      return res.status(422).send({
        message: '密码错误'
      })
    }
    // 返回token
    // jsonwebtoken
    const token = jwt.sign({
      id: user._id
    }, app.get('secret'))
    res.send({token})
  })
}