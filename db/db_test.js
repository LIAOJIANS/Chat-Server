/*
* 1、链接数据库
*
*/

// 1.1 引入mongoose md5加密
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')
// 1.2 链接制定数据库
mongoose.connect('mongodb://localhost:27017/chat')
// 1.3 获取连接对象
const conn = mongoose.connection
// 1.4 绑定链接完成的监听（用来提示链接成功）
conn.on('connected', function () {
    console.log('链接数据库成功！')
})

/*
* 2、得到对应集合model
*
*/
// 2.1、描述文档结构
const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    type: { type: String, required: true }
})
// 2.2、定义Model
const UserModel = mongoose.model('user', userSchema)

/*
* 3、通过Model或其实例集合数据进行CRUD操作
*
*/
// 3.1 save()添加方法
function testSave() {
    const userModel = new UserModel({username: 'tom', password: md5('1230'), type: 'dashen'})
    userModel.save(function (err, user) {
        console.log("save" + err, user)
    })
}
testSave()

// 3.2 find()/findOne()查找多个或一个的方法
function testFind() {
    // 查找多个
    UserModel.find(function (err, users) {
        console.log('find()', err, users)
    })
    // 查找一个
    UserModel.findOne({ username: 'tom' }, function (err, user) {
        console.log('findOne()', err, user)
    })
}
testFind()

// 3.3 通过findByIdAndUpdate()更新某个数据
function testUpdate() {
    UserModel.findByIdAndUpdate({  _id: '5d4bd3455f2d0a18980fb4e1' }, { username: 'bog' }, function (err, oldUser) {
        console.log("update", err, oldUser)
    })
}
testUpdate()
// 3.4 通过remove() 删除某个数据
function testDelet() {
    UserModel.remove({  _id: '5d4bd3455f2d0a18980fb4e1' }, function (err, doc) {
        console.log("delet()", err, doc)
    })
}
testDelet()
