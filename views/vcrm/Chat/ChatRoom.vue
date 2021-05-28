<template>
  <v-responsive
    v-if="messageTo"
    class="overflow-y-hidden fill-height chat-room"
    height="500"
  >
    <v-card
      flat
      class="d-flex flex-column fill-height"
    >
      <v-card-title>
        <div>
          {{ selectedRoom.title }}

          <v-menu
            max-width="300"
            min-width="300"
            offset-y
            transition="slide-y-transition"
            bottom
          >
            <template #activator="{ on, attrs }">
              <div
                class="grey--text subtitle-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ selectedRoom.userIds.length }}
                {{ selectedRoom.userIds.length | pluralize('участник', 'участника', 'участников') }}
              </div>
            </template>

            <v-list
              subheader
              flat
              dense
              class="pa-0"
            >
              <v-list-item-group>
                <template v-for="(item, index) in invitedUsers">
                  <v-list-item
                    :key="`parent${index}`"
                    :value="item._id"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-text="item.email" />

                      <v-list-item-subtitle v-text="item.position" />
                    </v-list-item-content>

                    <v-list-item-icon
                      v-if="item.id !== selectedRoom.ownerId && selectedRoom.isGroup && user.id === selectedRoom.ownerId"
                      @click="removeUserOfRoom(item)"
                    >
                      <v-icon>mdi-account-remove</v-icon>
                    </v-list-item-icon>
                  </v-list-item>

                  <v-divider
                    :key="`chatDivider${index}`"
                    class="my-0"
                  />
                </template>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </div>

        <v-menu
          v-if="selectedRoom.isGroup"
          max-width="300"
          min-width="300"
          offset-y
          transition="slide-y-transition"
          right
          bottom
        >
          <template #activator="{ on, attrs }">
            <v-btn
              class="ml-auto"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>
                mdi-account-multiple-plus
              </v-icon>
            </v-btn>
          </template>

          <v-list
            subheader
            flat
            dense
            class="pa-0"
          >
            <v-list-item-group>
              <template v-for="(item, index) in inviteUsers">
                <v-list-item
                  :key="`parent${index}`"
                  :value="item._id"
                  @click="invateUser(item)"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="item.email" />

                    <v-list-item-subtitle v-text="item.position" />
                  </v-list-item-content>
                </v-list-item>

                <v-divider
                  :key="`chatDivider${index}`"
                  class="my-0"
                />
              </template>
            </v-list-item-group>
          </v-list>
        </v-menu>
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

    userList: {
      type: Array,
      default: () => []
    },

    selectedRoom: {
      type: Object,
      default: () => {}
    },

    socket: {
      required: true
    },

    messageTo: {
      type: Object,
      default: () => {}
    }
  },

  data: () => ({
    roomInfo: null,
    messagesList: [],
    form: {
      content: ''
    }
  }),

  computed: {
    user() {
      return this.$store.state.profile.user
    },

    invitedUsers() {
      const { selectedRoom } = this

      return this.userList.filter((user) => {
        return selectedRoom.userIds.includes(user.id)
      })
    },

    inviteUsers() {
      const { selectedRoom } = this

      return this.userList.filter((user) => {
        return !selectedRoom.userIds.includes(user.id)
      })
    }
  },

  watch: {
    selectedRoom: {
      async handler(value) {
        if (value) {
          if (this.selectedRoom) {
            this.socket.emit('disc', this.selectedRoom._id)
          }

          this.socket.emit('init', this.selectedRoom._id)

          await this.markMessageRead(this.selectedRoom._id)

          await this.getMessage(this.selectedRoom._id)

          this.$nextTick(() => this.scrollToBottom())
        }
      },

      deep: true
    }
  },

  mounted() {
    this.socket.on('new message', (post) => {
      this.messagesList.push(post)

      setTimeout(() => {
        this.$nextTick(() => this.scrollToBottom())
      }, 0)
    })

    this.socket.on('remove message', (id) => {
      this.removeMessageById(id)
    })
  },

  methods: {
    async removeUserOfRoom(user) {
      try {
        await this.$apiClient.call(process.env.API_HOST_SOCKET + '/room/user/remove', {
          method: 'POST',
          body: JSON.stringify({ userId: user.id, roomId: this.selectedRoom._id }),
          headers: this.$apiClient.headers
        })
      } catch (error) {
        console.log(error)
      }
    },

    async invateUser(user) {
      try {
        await this.$apiClient.call(process.env.API_HOST_SOCKET + '/room/invite', {
          method: 'POST',
          body: JSON.stringify({ userId: user.id, roomId: this.selectedRoom._id }),
          headers: this.$apiClient.headers
        })
      } catch (error) {
        console.log(error)
      }
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
          `/room/${this.selectedRoom._id}/message`, {
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
        await this.$apiClient.call(process.env.API_HOST_SOCKET + `/delete/message/${id}/${this.selectedRoom._id}`, {
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
      const scrollbar = this.$refs.scrollbar

      if (scrollbar && scrollbar.scrollHeight >= scrollbar.scrollTop + scrollbar.clientHeight) {
        scrollbar.scrollTop = scrollbar.scrollHeight
      }
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
