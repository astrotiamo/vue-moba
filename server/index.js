const express = require('express')

const app = express()

app.set('secret', 'jelfij23ji')

app.use(require('cors')())
app.use(express.json())
// 静态文件  用express.static托管
app.use('/uploads', express.static(__dirname + '/uploads'))

require('./routes/admin')(app)
require('./plugins/db')(app)

app.listen(3000, () => {
  console.log('http://localhost:3000');
})