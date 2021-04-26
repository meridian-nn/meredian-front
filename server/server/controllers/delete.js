import ChatMessageModel from '../models/ChatMessage.js';
import makeValidation from '@withvoid/make-validation';

export default {
  deleteMessageById: async (req, res) => {
    try {
      const validation = makeValidation(types => ({
        payload: req.params,
        checks: {
          messageId: {
            type: types.string
          },
          roomId: {
            type: types.string
          }
        }
      }));
      if (!validation.success) return res.status(400).json({ ...validation });

      const { messageId, roomId } = req.params;
      const message = await ChatMessageModel.removeMessageById(messageId);

      global.io.sockets.in(roomId).emit('remove message', messageId);

      return res.status(200).json({
        success: true, 
        deletedMessagesCount: message.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
}