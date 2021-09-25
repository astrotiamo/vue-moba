module.exports = options => {
  const AdminUser = require('../models/AdminUser')
  const jwt = require('jsonwebtoken')
  // http-assert
  const assert = require('http-assert')

  return async (req, res, next) => {
    // 获取token并去除'Bearer '
    const token = String(req.headers.authorization || '').split(' ').pop()
    assert(token, 401, '请先登录')  // 请提供jwt token
    // 验证解析token { id: '61385e2067ed16ed8af881c0', iat: 1631089410 }
    const { id } = jwt.verify(token, req.app.get('secret'))
    assert(id, 401, '请先登录')  // 无效的jwt token
    req.user = await AdminUser.findById(id)
    assert(req.user, 401, '请先登录')
    // console.log(req.user);
    // console.log(tokenData);
    // console.log(token);
    await next()
  }
}