import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

const MESSAGE_TYPES = {
  TYPE_TEXT: 'text'
}

const readByRecipientSchema = new mongoose.Schema(
  {
    _id: false,
    readByUserId: String,
    readAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    timestamps: false
  }
)

const chatMessageSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, '')
    },
    chatRoomId: String,
    message: mongoose.Schema.Types.Mixed,
    user: Object,
    parentId: mongoose.Schema.Types.Mixed,
    parentMessage: mongoose.Schema.Types.Mixed,
    postedByUser: String,
    readByRecipients: [readByRecipientSchema]
  },
  {
    timestamps: true,
    collection: 'chatmessages'
  }
)

/**
 * This method will create a post in chat
 *
 * @param {String} roomId - id of chat room
 * @param {Object} message - mes+sage you want to post in the chat room
 * @param {String} postedByUser - user who is posting the message
 */
chatMessageSchema.statics.createPostInChatRoom = async function(chatRoomId, messageText, user, parentMessage) {
  try {
    const post = await this.create({
      chatRoomId,
      message: messageText,
      user,
      parentId: parentMessage ? parentMessage._id : null,
      postedByUser: user.id,
      readByRecipients: { readByUserId: user.id }
    })

    return post
  } catch (error) {
    throw error
  }
}

chatMessageSchema.statics.updatePostInChatRoom = async function(messageId, messageText, user) {
  try {
    const message = await this.findOneAndUpdate(
      { _id: messageId },
      {
        $set: {
          message: messageText,
          user
        }
      },
      { new: true }
    )

    return message
  } catch (error) {
    throw error
  }
}

chatMessageSchema.statics.getMessageById = async function(id) {
  try {
    const post = await this.findOne({
      _id: id
    })

    return post
  } catch (e) {
    throw error
  }
}

/**
 * @param {String} chatRoomId - chat room id
 */
chatMessageSchema.statics.getConversationByRoomId = async function(chatRoomId, options = {}) {
  try {
    return this.aggregate([
      { $match: { chatRoomId } },
      { $sort: { createdAt: -1 } },

      {
        $lookup: {
          from: 'chatmessages',
          localField: 'parentId',
          foreignField: '_id',
          as: 'parentMessage'
        }
      },

      {
        $unwind: {
          path: '$parentMessage',
          preserveNullAndEmptyArrays: true
        }
      },

      { $unwind: '$postedByUser' },
      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } }
    ])
  } catch (error) {
    throw error
  }
}

/**
 * @param {String} chatRoomId - chat room id
 * @param {String} currentUserOnlineId - user id
 */
chatMessageSchema.statics.markMessageRead = async function(chatRoomId, currentUserOnlineId) {
  try {
    return this.updateMany(
      {
        chatRoomId,
        'readByRecipients.readByUserId': { $ne: currentUserOnlineId }
      },
      {
        $addToSet: {
          readByRecipients: { readByUserId: currentUserOnlineId }
        }
      },
      {
        multi: true
      }
    )
  } catch (error) {
    throw error
  }
}

/**
 * @param {Array} chatRoomIds - chat room ids
 * @param {{ page, limit }} options - pagination options
 * @param {String} currentUserOnlineId - user id
 */
chatMessageSchema.statics.getRecentConversation = async function(chatRoomIds, options, currentUserOnlineId) {
  try {
    return this.aggregate([
      { $match: { chatRoomId: { $in: chatRoomIds } } },
      {
        $group: {
          _id: '$chatRoomId',
          messageId: { $last: '$_id' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          createdAt: { $last: '$createdAt' },
          readByRecipients: { $last: '$readByRecipients' }
        }
      },
      { $sort: { createdAt: -1 } },
      // do a join on another table called users, and
      // get me a user whose _id = postedByUser
      {
        $lookup: {
          from: 'users',
          localField: 'postedByUser',
          foreignField: '_id',
          as: 'postedByUser'
        }
      },
      { $unwind: '$postedByUser' },
      // do a join on another table called chatrooms, and
      // get me room details
      {
        $lookup: {
          from: 'chatrooms',
          localField: '_id',
          foreignField: '_id',
          as: 'roomInfo'
        }
      },
      { $unwind: '$roomInfo' },
      { $unwind: '$roomInfo.userIds' },
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'roomInfo.userIds',
          foreignField: '_id',
          as: 'roomInfo.userProfile'
        }
      },
      { $unwind: '$readByRecipients' },
      // do a join on another table called users
      {
        $lookup: {
          from: 'users',
          localField: 'readByRecipients.readByUserId',
          foreignField: '_id',
          as: 'readByRecipients.readByUser'
        }
      },

      {
        $group: {
          _id: '$roomInfo._id',
          messageId: { $last: '$messageId' },
          chatRoomId: { $last: '$chatRoomId' },
          message: { $last: '$message' },
          type: { $last: '$type' },
          postedByUser: { $last: '$postedByUser' },
          readByRecipients: { $addToSet: '$readByRecipients' },
          roomInfo: { $addToSet: '$roomInfo.userProfile' },
          createdAt: { $last: '$createdAt' }
        }
      },
      // apply pagination
      { $skip: options.page * options.limit },
      { $limit: options.limit }
    ])
  } catch (error) {
    throw error
  }
}

/**
 * @param {String} user - user info
 */

chatMessageSchema.statics.updateUserInfoInMessages = async function(user) {
  try {
    await this.updateMany({ 'user.id': user.id }, { user })
  } catch (error) {
    throw error
  }
}

/**
 * @param {String} id - messages id
 */
chatMessageSchema.statics.removeMessageById = async function(id) {
  try {
    const result = await this.remove({ _id: id })

    return result
  } catch (error) {
    throw error
  }
}

export default mongoose.model('ChatMessage', chatMessageSchema)
