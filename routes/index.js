var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
// 用户注册路由
router.post('/register', function (req, res) {
    // 1、获取请求参数
    const { username, password } = req.body
    // 2、判断是否已经注册过
    if(username === 'admin') {
      // 返回相应数据（失败）
      res.send({code: 1, msg: '此用户已存在'})
    } else {
      // 返回相应数据（成功）
      res.send({code: 0, data: {id: 'abc123', username, password}})
    }
})



module.exports = router;
