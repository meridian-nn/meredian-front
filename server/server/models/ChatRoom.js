import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'
const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    userIds: Array,
    isNewMessages: {
      type: Number,
      default: 0
    }
  },
  {
    collection: 'chatrooms'
  }
)

/**
 * @param {String} userId - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */
chatRoomSchema.statics.updateUsersInRoom = async function(userIds, projectId) {
  try {
    const room = await this.findOneAndUpdate(
      { projectId },
      { $set: { userIds } },
      { new: true }
    )

    return room
  } catch (error) {
    throw error
  }
}

/**
 * @param {String} userId - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */
chatRoomSchema.statics.getChatRoomsByUserId = async function(userId) {
  try {
    const rooms = await this.find({ userIds: { $all: [userId] } })

    return rooms
  } catch (error) {
    throw error
  }
}

/**
 * @param {String} roomId - id of chatroom
 * @return {Object} chatroom
 */
chatRoomSchema.statics.getChatRoomByRoomId = async function(roomId) {
  try {
    const room = await this.findOne({ _id: roomId })

    return room
  } catch (error) {
    throw error
  }
}

/**
 * @param {Array} userIds - array of strings of userIds
 */
chatRoomSchema.statics.initiateChat = async function(userIds) {
  try {
    const availableRoom = await this.findOne({ userIds: { $all: [...userIds] } })

    if (availableRoom) {
      return { data: availableRoom, new: false }
    }

    const newRoom = await this.create({ userIds })

    return { data: newRoom, new: true }
  } catch (error) {
    console.log('error on start chat method', error)
    throw error
  }
}

export default mongoose.model('ChatRoom', chatRoomSchema)
