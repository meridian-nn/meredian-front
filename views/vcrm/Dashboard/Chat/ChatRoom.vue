<template>
  <v-responsive
    class="overflow-y-hidden fill-height chat-room"
    height="500"
  >
    <v-card
      flat
      class="d-flex flex-column fill-height"
    >
      <v-card-title>
        {{ messageTo.email }}
      </v-card-title>

      <v-card-text
        ref="scrollbar"
        class="flex-grow-1 overflow-y-auto"
      >
        <template v-for="(msg, i) in messagesList">
          <chat-message
            :key="i"
            :msg="msg"
            :is-my="user.id === msg.user.id"
            @removeMessage="removeMessage"
          />
        </template>
      </v-card-text>

      <v-card-text class="flex-shrink-1">
        <v-text-field
          v-model="form.content"
          label="Напишите сообщение"
          type="text"
          no-details
          outlined
          append-outer-icon="mdi-send"
          hide-details
          @keyup.enter="submitMessage"
          @click:append-outer="submitMessage"
        />
      </v-card-text>
    </v-card>
  </v-responsive>
</template>

<script>
import debounce from 'lodash/debounce'
import { io } from 'socket.io-client'
import ChatMessage from './ChatMessage'
export default {
  name: 'ChatRoom',

  components: {
    ChatMessage
  },

  props: {
    activeChat: {
      type: Number,
      default: 1
    },

    messageTo: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({
    socket: io(process.env.API_HOST_SOCKET),
    roomInfo: null,
    messagesList: [],
    form: {
      content: ''
    }
  }),

  watch: {
    messageTo: {
      async handler() {
        await this.getRoomInfo()

        this.socket.emit('init', this.roomInfo._id)

        await this.markMessageRead(this.roomInfo._id)

        this.getMessage(this.roomInfo._id)
      },

      deep: true
    }
  },

  mounted() {
    this.socket.on('new message', (post) => {
      this.messagesList.push(post)

      this.$nextTick(() => this.scrollToBottom())
    })

    this.socket.on('remove message', (id) => {
      this.removeMessageById(id)
    })
  },

  methods: {
    async getRoomInfo() {
      const room = await this.$apiClient.call(process.env.API_HOST_SOCKET + '/room/initiate', {
        method: 'POST',
        body: JSON.stringify({ userIds: [this.user.id, this.messageTo.id] }),
        headers: this.$apiClient.headers
      })

      this.roomInfo = room.data
    },

    async markMessageRead(roomId) {
      await this.$apiClient.call(process.env.API_HOST_SOCKET + `/room/${roomId}/mark-read`, {
        method: 'PUT',
        body: JSON.stringify({ userId: this.user.id }),
        headers: this.$apiClient.headers
      })
    },

    async getMessage(roomId) {
      const messages = await this.$apiClient.call(process.env.API_HOST_SOCKET +
        `/room/${roomId}`, {
        method: 'GET',
        headers: this.$apiClient.headers
      })

      this.messagesList = messages.data
    },

    removeMessageById(id) {
      const { messagesList } = this

      for (let i = 0; i < messagesList.length; i++) {
        if (messagesList[i].parentMessage && messagesList[i].parentMessage._id === id) {
          messagesList[i].parentMessage = null
        }
      }

      for (let i = 0; i < messagesList.length; i++) {
        if (messagesList[i]._id === id) {
          messagesList.splice(i, 1)
        }
      }
    },

    submitMessage() {
      this.sendMessage()
    },

    submitMessageEnterOnInput(e) {
      if (e.which === 13 && !e.shiftKey) {
        e.preventDefault()

        this.submitMessage()
      }
    },

    sendMessage: debounce(async function() {
      try {
        this.form.content.length > 0 && await this.$apiClient.call(process.env.API_HOST_SOCKET +
          `/room/${this.roomInfo._id}/message`, {
          method: 'POST',
          body: JSON.stringify({ messageText: this.form.content, user: this.user }),
          headers: this.$apiClient.headers
        })

        this.form.content = ''
      } catch (e) {
        console.log(e)
      }
    }, 500, { leading: true }),

    removeMessage: debounce(async function(id) {
      try {
        await this.$apiClient.call(process.env.API_HOST_SOCKET + `/delete/message/${id}/${this.roomInfo._id}`, {
          method: 'DELETE'
        })
      } catch (e) {
        console.log(e)
      }
    }, 500, { leading: true }),

    focusOnInput() {
      this.$refs.input.focus()
    },

    scrollToBottom() {
      const scrollbar = this.$refs.scrollbar.$el

      if (scrollbar && scrollbar.scrollHeight >= scrollbar.scrollTop + scrollbar.clientHeight) {
        scrollbar.scrollTop = scrollbar.scrollHeight
      }
    }
  },

  destroyed() {
    this.socket.close()
  },

  computed: {
    user() {
      return this.$store.state.profile.user
    }
  }
}
</script>

<style>
.chat-room .v-chip .v-chip__content {
  display: inline-block;
  position: relative;
  padding-top: 13px;
  min-width: 150px;
}

.chat-room .v-chip .v-chip__content sub{
  position: absolute;
  top: 4px;
  left: 0;
}
</style>
