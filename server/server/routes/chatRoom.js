import express from 'express'
// controllers
import chatRoom from '../controllers/chatRoom.js'

const router = express.Router()

router
  .get('/', chatRoom.getRecentConversation)
  .get('/:roomId', chatRoom.getConversationByRoomId)
  .post('/initiate', chatRoom.initiate)
  .post('/list', chatRoom.getRoomsByUserId)
  .post('/:roomId/message', chatRoom.postMessage)
  .post('/:roomId/message/:parentId', chatRoom.postMessage)
  .put('/:roomId/message/:messageId', chatRoom.editMessage)
  .put('/:roomId/mark-read', chatRoom.markConversationReadByRoomId)

export default router
