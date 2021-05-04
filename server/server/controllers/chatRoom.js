// utils
import makeValidation from '@withvoid/make-validation'
// models
import ChatRoomModel from '../models/ChatRoom.js'
import ChatMessageModel from '../models/ChatMessage.js'

export default {
  initiate: async(req, res) => {
    try {
      const { userIds } = req.body

      const chatRooms = await ChatRoomModel.initiateChat(userIds)

      if (chatRooms.new) {
        global.io.sockets.emit('update rooms', chatRooms.data)
      }

      return res.status(200).json({ success: true, data: chatRooms.data })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  createRoom: async(req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.body,
        checks: {
          userIds: {
            type: types.array,
            options: { unique: true, empty: false, stringOnly: true }
          },
          projectId: {
            type: types.string
          }
        }
      }))
      if (!validation.success) { return res.status(400).json({ ...validation }) }

      const { userIds, projectId } = req.body

      const chatRoom = await ChatRoomModel.initiateChat(userIds, projectId)

      return res.status(200).json({ success: true, chatRoom })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  postMessage: async(req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: { ...req.params, ...req.body },
        checks: {
          roomId: { type: types.string },
          messageText: { type: types.string, options: { empty: false } }
        }
      }))

      if (!validation.success) { return res.status(400).json({ ...validation }) }

      const { roomId } = req.params
      const { user, messageText, parentMessage } = req.body

      const post = await ChatMessageModel.createPostInChatRoom(roomId, messageText, user, parentMessage)
      post.parentMessage = parentMessage

      global.io.sockets.in(roomId).emit('new message', post)

      return res.status(200).json({ success: true, post })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  editMessage: async(req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: { ...req.params, ...req.body },
        checks: {
          roomId: { type: types.string },
          messageText: { type: types.string, options: { empty: false } }
        }
      }))

      if (!validation.success) { return res.status(400).json({ ...validation }) }

      const { roomId, messageId } = req.params
      const { user, messageText } = req.body
      if (req.userId !== user.id) {
        return res.status(400).json({ success: false, error: 'User data does not converge' })
      }
      const message = await ChatMessageModel.updatePostInChatRoom(messageId, messageText, user)

      global.io.sockets.in(roomId).emit('update message', message)

      return res.status(200).json({ success: true, message })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  getRoomsByUserId: async(req, res) => {
    const { userId } = req.body
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 40
    }
    const rooms = await ChatRoomModel.getChatRoomsByUserId(userId)

    for (const room of rooms) {
      const messages = await ChatMessageModel.getConversationByRoomId(room._id, options)

      const check = messages.find((item) => {
        return item.readByRecipients.filter((item) => {
          return Number(item.readByUserId) !== userId
        })
      })

      if (check) {
        room.isNewMessage = true
      }
    }

    return res.status(200).json({ success: true, data: rooms })
  },

  getRecentConversation: async(req, res) => {
    try {
      const currentLoggedUser = req.userId
      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 40
      }
      const rooms = await ChatRoomModel.getChatRoomsByUserId(currentLoggedUser)
      const roomIds = rooms.map(room => room._id)
      const recentConversation = await ChatMessageModel.getRecentConversation(
        roomIds, options, currentLoggedUser
      )

      return res.status(200).json({ success: true, conversation: recentConversation })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  getConversationByRoomId: async(req, res) => {
    try {
      const { roomId } = req.params
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)

      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id'
        })
      }

      const options = {
        page: parseInt(req.query.page) || 0,
        limit: parseInt(req.query.limit) || 40
      }

      const conversation = await ChatMessageModel.getConversationByRoomId(roomId, options)

      return res.status(200).json({
        success: true,
        data: conversation
      })
    } catch (error) {
      return res.status(500).json({ success: false, error })
    }
  },

  markConversationReadByRoomId: async(req, res) => {
    try {
      const { roomId } = req.params
      const room = await ChatRoomModel.getChatRoomByRoomId(roomId)
      if (!room) {
        return res.status(400).json({
          success: false,
          message: 'No room exists for this id'
        })
      }

      const { userId } = req.body
      const result = await ChatMessageModel.markMessageRead(roomId, userId)

      return res.status(200).json({ success: true, data: result })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ success: false, error })
    }
  }
}
