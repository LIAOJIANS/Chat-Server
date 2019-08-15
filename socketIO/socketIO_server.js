const { ChatModel } = require('../db/model')
module.exports = function (server) {
    // 得到 IO 对象
    const io = require('socket.io')(server)
    // 监视连接(当有一个客户连接上时回调)
    io.on('connection', function (socket) {
        // 绑定 sendMsg 监听, 接收客户端发送的消息
        socket.on('sendMsg', function ({ from, to, content }) {
            console.log('服务器接收到浏览器的消息', { from, to, content })
            // 向客户端发送消息(名称, 数据)
            const chat_id = [ from, to ].sort().join('_')
            const create_time = Date.now()
            new ChatModel({ from, to, content, chat_id, create_time }).save(function (err, chatMsg) {
                // 向客户端发消息
                io.emit('receiveMsg', chatMsg)
                console.log('服务器向浏览器发送消息', chatMsg)
            })

        })
    })
}
