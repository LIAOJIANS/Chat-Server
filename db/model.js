/* 包含N个操作数据库集合数据的Model模块 */


/* 1、链接数据库 */
// 1.1 引入mongoose
const mongoose = require('mongoose')

// 1.2 链接制定数据库
mongoose.connect('mongodb://localhost:27017/chat')

// 1.3 获取链接对象
const conn = mongoose.connection

// 1.4 绑定链接完成的监听
conn.on('connected', () => {
    console.log('链接数据库成功咯！')
})

/* 定义出对应集合的Model并向外暴露 */
// 2.1 字义Schema
const userSchema = mongoose.Schema({
    username: { type: String, require: true }, // 用户名
    password: { type: String, require: true }, // 密码
    type: { type: String, require: true }, // 用户类型： dashen/laoban
    header: { type: String }, // 头像名称
    post: { type: String }, // 职位
    info: { type: String }, // 个人或职位简介
    company: { type: String }, // 公司名称
    salary: { type: String },  // 工资
})

// 2.2 定义Model
const UserModel = mongoose.model('user', userSchema)

// 2.3 向外暴露一个Model
exports.UserModel = UserModel // 用户信息Model
