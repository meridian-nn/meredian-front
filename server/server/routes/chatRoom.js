import express from 'express'
// controllers
import chatRoom from '../controllers/chatRoom.js'

const router = express.Router()

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/user/remove', chatRoom.removeUserOfGroupRoom)
  .post('/initiate', chatRoom.initiate)
  .post('/list', chatRoom.getRoomsByUserId)
  .post('/:roomId/message', chatRoom.postMessage)
  .post('/:roomId/message/:parentId', chatRoom.postMessage)
  .post('/invite', chatRoom.joinRoom)
  .post('/group/create', chatRoom.createGroupRoom)
  .put('/:roomId/message/:messageId', chatRoom.editMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router
