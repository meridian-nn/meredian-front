<template>
  <v-container
    class="fill-height pa-0 "
  >
    <v-row class="no-gutters elevation-4">
      <v-col
        cols="12"
        sm="3"
        class="flex-grow-1 flex-shrink-0"
        style="border-right: 1px solid #0000001f;"
      >
        <v-responsive
          class="overflow-y-auto fill-height"
          height="420"
        >
          <v-list subheader>
            <v-list-item-group v-model="activeChat">
              <template v-for="(item, index) in roomsAggregateList">
                <v-list-item
                  :key="`parent${index}`"
                  :value="item.id"
                  @click="selectRoom(item)"
                >
                  <v-list-item-avatar color="grey lighten-1 white--text">
                    <v-icon :color="item.active ? 'deep-purple accent-4' : 'white'">
                      mdi-message-bulleted
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content v-if="item.userInfo">
                    <v-list-item-title v-text="item.userInfo.email " />

                    <v-list-item-subtitle v-text="item.userInfo.position" />
                  </v-list-item-content>

                  <v-list-item-icon>
                    <v-icon @click.stop="removeRoom(item._id, index)">
                      mdi-delete
                    </v-icon>
                  </v-list-item-icon>
                </v-list-item>

                <v-divider
                  :key="`chatDivider${index}`"
                  class="my-0"
                />
              </template>
            </v-list-item-group>
          </v-list>
        </v-responsive>

        <v-menu
          max-width="300"
          min-width="300"
          offset-y
          transition="slide-y-transition"
          right
          top
        >
          <template #activator="{ on, attrs }">
            <div class="pa-4">
              <v-btn
                class="mt-auto"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon color="blue">
                  mdi-menu
                </v-icon>

                Список пользователей
              </v-btn>
            </div>
          </template>

          <v-list
            subheader
            flat
            dense
            class="pa-0"
          >
            <v-list-item-group>
              <template v-for="(item, index) in users">
                <v-list-item
                  :key="`parent${index}`"
                  :value="item._id"
                  @click="selectUser(item)"
                >
                  <v-list-item-avatar color="grey lighten-1 white--text">
                    <v-icon>
                      mdi-message-bulleted
                    </v-icon>
                  </v-list-item-avatar>

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
      </v-col>

      <v-col
        cols="auto"
        class="flex-grow-1 flex-shrink-0"
      >
        <chat-room
          :socket="socket"
          :active-chat="activeChat"
          :message-to="selectedUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { io } from 'socket.io-client'
import ChatRoom from './ChatRoom'
export default {
  name: 'Chat',

  components: {
    ChatRoom
  },

  async asyncData({ $api, $apiClient, store }) {
    const users = await $api.auth.users.get()

    const rooms = await $apiClient.call(process.env.API_HOST_SOCKET + '/room/list', {
      method: 'POST',
      body: JSON.stringify({ userId: store.state.profile.user.id }),
      headers: $apiClient.headers
    })

    return { userList: users, roomsList: rooms.data }
  },

  data: () => ({
    socket: io(process.env.API_HOST_SOCKET),
    activeChat: null,
    selectedUser: null
  }),

  computed: {
    user() {
      return this.$store.state.profile.user
    },

    roomsAggregateList() {
      const { findUserById } = this

      return this.roomsList.map((item) => {
        return { ...item, userInfo: findUserById(item)[0] }
      })
    },

    users() {
      const { user } = this

      return this.userList.filter(item => item.id !== user.id)
    }
  },

  destroyed() {
    this.socket.close()
  },

  mounted() {
    this.socket.on('update rooms', (room) => {
      if (room.userIds.includes(this.user.id)) {
        this.roomsList.push(room)
      }
    })

    this.socket.on('remove room', (roomId) => {
      this.roomsList = this.roomsList.filter(item => item._id !== roomId)

      this.selectedUser = null
    })
  },

  methods: {
    async removeRoom(id, i) {
      await this.$apiClient.call(process.env.API_HOST_SOCKET +
        `/delete/room/${id}`, {
        method: 'DELETE'
      })

      this.removeRoomByIndex(i)

      this.selectedUser = null
    },

    removeRoomByIndex(i) {
      this.roomsList.splice(i, 1)
    },

    selectUser(user) {
      this.selectedUser = user

      const index = this.roomsList.findIndex(item => item.userIds.includes(user.id))

      this.activeChat = index === -1 ? null : index
    },

    selectRoom(room) {
      if (this.socket.connected) {
        this.selectedUser = this.findUserById(room)[0]
      }
    },

    findUserById(room) {
      const { user } = this

      return this.users.filter((item) => {
        const roomUsers = room.userIds.filter(userItem => userItem !== user.id)

        return roomUsers.includes(item.id)
      })
    },

    scrollToBottom() {
      const scrollbar = this.$refs.scrollbar.$el

      if (scrollbar && scrollbar.scrollHeight >= scrollbar.scrollTop + scrollbar.clientHeight) {
        scrollbar.scrollTop = scrollbar.scrollHeight
      }
    }
  }
}
</script>

<style lang='scss'>

</style>
