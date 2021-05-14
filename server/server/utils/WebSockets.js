class WebSockets {
  users = []
  connection(client) {
    // event fired when the chat room is disconnected

    client.on('init', (roomId) => {
      client.join(roomId)
    })

    client.on('disc', (roomId) => {
      client.leave(roomId)
    })

    // add identity of user mapped to the socket id
    client.on('identity', (userId) => {
      this.users.push({
        socketId: client.id,
        userId
      })
    })
    // subscribe person to chat & other user as well
    client.on('subscribe', (room, otherUserId = '') => {
      WebSockets.subscribeOtherUser(room, otherUserId)
      client.join(room)
    })
    // mute a chat room
    client.on('unsubscribe', (room) => {
      client.leave(room)
    })
  }

  subscribeOtherUser(room, otherUserId) {
    const userSockets = WebSockets.users.filter(
      user => user.userId === otherUserId
    )
    userSockets.map((userInfo) => {
      const socketConn = global.io.sockets.connected(userInfo.socketId)
      if (socketConn) {
        socketConn.join(room)
      }
    })
  }
}

export default new WebSockets()
