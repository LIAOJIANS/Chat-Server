var express = require('express');
var router = express.Router();

// 引入Model
const { UserModel, ChatModel } = require('../db/model')
const md5 = require('blueimp-md5')
const filter = { password: 0, __v: 0 } // 指定过滤的属性
const city = require('../data/cities')
const school = require('../data/shools')
const province = require('../data/provinces')
// 用户注册路由
router.post('/register', function (req, res) {
    // 1、获取请求参数
    const { username, password, type } = req.body
    if (!username) {
        res.send({ code: 1, msg: '用户名没有指定！' })
        return
    } else if (!password) {
        res.send({ code: 1, msg: '密码没有指定！' })
        return
    } else if (!type) {
        res.send({ code: 1, msg: '类型没有指定！' })
        return;
    }
    // 2、判断是否已经注册过
    UserModel.findOne({ username }, function (err, user) {
        if (user) { // 如果存在
            res.send({ code: 1, msg: '此用户已注册！' }) // 返回信息
        } else { // 不存在
            // 向数据库存储数据
            new UserModel({ username, type, password: md5(password) }).save(function (err, user) {
                res.cookie('userid', user._id, { maxAge: 1000*60*60*24 }) // 存储一天的cookie信息
                res.send({ code: 0, data: { username, type, _id: user._id } })
            })
        }
    })
})

// 用户登录路由
router.post('/login', function (req, res) {
    const { username, password } = req.body
    UserModel.findOne({ username, password: md5(password) }, filter, function (err, user) {
        if (user) {
            res.cookie('userid', user._id, { maxAge: 1000*60*60*24 }) // 存储一天的cookie信息
            res.send({ code: 0, data: user })
        } else {
            res.send({ code: 1, msg: '用户名或密码不正确！' }) // 返回信息
        }
    })
})

// 用户完善信路由
router.post('/updata', function (req, res) {
    // 1、获取用户要修改的信息集合
    const user = req.body
    // 2、判断用户是否在 登录状态
    const userid = req.cookies.userid
    if(!userid) {
        return res.send({ code: 1, msg: '未登录' })
    }
    // 3、根据userid去修改用户信息
    UserModel.findByIdAndUpdate({ _id: userid }, user, function (err, OldUser) {
        // 判断是否有这位老哥
        if(!OldUser) {
            // 清除cookie
            res.clearColor('userid')
            // 返回信息
            res.send({ code: 1, msg: '未登录' })
        } else {
            // 准备一个返回user数据对象
            const { _id, username, type } = OldUser
            // 组合返回数组
            const data = Object.assign({ _id, username, type }, user)
            res.send({ code: 0, data })
        }
    })
})

// 获取当前用户的信息
router.get('/user', function (req, res) {
    // 1、判断用户是否在 登录状态
    const userid = req.cookies.userid
    if(!userid) {
        res.send({ code: 1, msg: '未登录' })
    }
    UserModel.findOne({ _id: userid }, filter, function (err, user) {
        res.send({ code: 0, data: user })
    })
})

// 根据用户类型获取用户列表
router.get('/userlist', function (req, res) {
    const { type } = req.query
    UserModel.find({ type }, filter, function (err, userList) {
        res.send({ code: 0, data: userList })
    })
})

// 获取聊天信息列表
router.get('/msglist', function (req, res) {
    // 获取当前登录的cookie
    const userid = req.cookies.userid
    // 查询user对象
    UserModel.find(function (err, userdDoc) {
        // 获取所有用户的头像和名字
         const users =  userdDoc.reduce((users, user) => {
            users[user._id] = { username: user.username, header: user.header }
            return users
        }, {})
        // 查询聊天信息
        ChatModel.find({ '$or': [ { from: userid }, { to: userid } ] }, function (err, chatMsgs) {
            res.send({ code: 0, data: { users, chatMsgs } })
        })
    })
})

// 修改指定消息为已读
router.post('/readmsg', function (req, res) {
    // 得到请求中的from和to
    const from = req.body.from
    const to = req.cookies.userid
    console.log('from' + from, to)
    ChatModel.update({ from, to, read: false }, { read: true }, { multi: true }, function (err, doc) {

        res.send({ code: 0, data: doc.nModified }) // 更新的数量
    })
})

// 选择城市
router.get('/city', function (req, res) {

    res.send({ code: 0, data: city })
})

// 选择学校
router.get('/school', function (req, res) {

    res.send({ code: 0, data: school })
})

// 选择省份
router.get('/province', function (req, res) {

    res.send({ code: 0, data: province })
})

module.exports = router;
