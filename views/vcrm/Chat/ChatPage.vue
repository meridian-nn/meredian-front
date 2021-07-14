<template>
  <v-container
    class="py-6 px-6"
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
          height="550"
          max-height="75vh"
          min-height="300"
        >
          <v-list subheader>
            <v-list-item-group v-model="activeChat">
              <template v-for="(item, index) in roomsAggregateList">
                <v-list-item
                  :key="`parent${index}`"
                  :value="item.id"
                  @click="selectRoom(item)"
                >
                  <v-list-item-avatar
                    v-if="item.isNewMessages === 0"
                    color="grey lighten-1 white--text"
                  >
                    <v-icon color="white">
                      mdi-message-bulleted
                    </v-icon>
                  </v-list-item-avatar>

                  <v-badge
                    v-else
                    overlap
                    offset-x="29"
                    offset-y="23"
                    color="green"
                    :content="item.isNewMessages"
                  >
                    <v-list-item-avatar color="grey ml-0 lighten-1 white--text">
                      <v-icon color="white">
                        mdi-message-bulleted
                      </v-icon>
                    </v-list-item-avatar>
                  </v-badge>

                  <v-list-item-content v-if="item.userInfo">
                    <v-list-item-title v-text="item.userInfo.email " />

                    <v-list-item-subtitle v-text="item.userInfo.position" />
                  </v-list-item-content>

                  <v-list-item-content v-else>
                    <v-list-item-title v-text="item.title" />
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

        <div class="pa-4 d-flex justify-space-around">
          <v-menu
            max-width="300"
            min-width="300"
            offset-y
            transition="slide-y-transition"
            right
            top
          >
            <template #activator="{ on, attrs }">
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

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                class="ml-auto"
                fab
                dark
                v-bind="attrs"
                small
                color="primary"
                v-on="on"
                @click="modals.createGroupRoom = true"
              >
                <v-icon dark>
                  mdi-account-multiple
                </v-icon>
              </v-btn>
            </template>
            <span>Создать групповой чат</span>
          </v-tooltip>
        </div>
      </v-col>

      <v-col
        cols="auto"
        class="flex-grow-1 flex-shrink-0"
      >
        <chat-room
          ref="room"
          :socket="socket"
          :user-list="userList"
          :active-chat="activeChat"
          :selected-room="selectedRoom"
          :message-to="selectedUser"
        />
      </v-col>
    </v-row>

    <modal-create-group-room-modal
      :show="modals.createGroupRoom"
      :users="users"
      @close="modals.createGroupRoom = false"
      @success="createGroupRoom"
    />
  </v-container>
</template>

<script>
import { io } from 'socket.io-client'
import ChatRoom from './ChatRoom'
import ModalCreateGroupRoomModal from './Modals/CreateGroupRoom'
import { findByIdInArray, findIndexByIdInArray } from '~/utils/helpers'
export default {
  name: 'Chat',

  components: {
    ChatRoom,
    ModalCreateGroupRoomModal
  },

  async asyncData({ $api, $apiClient, store }) {
    const users = await $api.auth.users.get()

    const rooms = await $apiClient.call(process.env.API_HOST_SOCKET + '/room/list', {
      method: 'POST',
      body: JSON.stringify({ userId: store.state.profile.user.id }),
      headers: $apiClient.headersJson
    })

    return { userList: [...users], roomsList: [...rooms.data] }
  },

  data: () => ({
    socket: io(process.env.API_HOST_SOCKET),
    modals: {
      createGroupRoom: false
    },
    activeChat: null,
    selectedUser: null,
    selectedRoom: null
  }),

  computed: {
    user() {
      return this.$store.state.profile.user
    },

    roomsAggregateList() {
      const { findUserById } = this

      return this.roomsList.map((item) => {
        // eslint-disable-next-line no-unused-expressions
        item.isNewMessages
        if (item.title.length === 0) {
          return { ...item, userInfo: findUserById(item)[0] }
        } else {
          return item
        }
      })
    },

    users() {
      const { user } = this

      return this.userList.filter(item => item.id !== user.id)
    }
  },

  watch: {
    roomsList: {
      deep: true,
      handler(value) {
        if (this.selectedRoom) {
          const selectedRoom = findByIdInArray(this.selectedRoom._id, value)
          if (selectedRoom) {
            this.selectedRoom = selectedRoom
          }
        }
      }
    }
  },

  destroyed() {
    this.socket.close()
  },

  mounted() {
    this.socket.emit('identity', this.user.id)

    this.socket.on('update rooms', (room) => {
      const findRoom = findByIdInArray(room._id, this.roomsList)

      if (findRoom) {
        if (room.userIds.includes(this.user.id)) {
          this.$set(this.roomsList, findIndexByIdInArray(room._id, this.roomsList), room)
          this.roomsList[findIndexByIdInArray(room._id, this.roomsList)] = room
        } else {
          this.removeRoomById(room._id)
        }
      } else {
        this.addRoom(room)
      }
    })

    this.socket.on('remove room', (roomId) => {
      this.removeRoomById(roomId)
    })

    this.socket.on('show new message', (post) => {
      const { selectedRoom } = this

      for (const room of this.roomsList) {
        if (room._id === post.chatRoomId) {
          if (!selectedRoom) {
            room.isNewMessages += 1
          } else if (selectedRoom._id !== room._id) {
            room.isNewMessages += 1
          } else if (selectedRoom._id === room._id) {
            this.$refs.room.markMessageRead(room._id)
          }
        }
      }
    })
  },

  methods: {
    createGroupRoom(room) {
      this.addRoom(room)
    },

    addRoom(room) {
      if (room.userIds.includes(this.user.id)) {
        this.roomsList.push(room)
      }
    },

    removeRoomById(roomId) {
      if (this.selectedRoom && this.selectedRoom._id === roomId) {
        this.selectedUser = null
        this.selectedRoom = null
      }

      this.roomsList = this.roomsList.filter(item => item._id !== roomId)
    },

    async removeRoom(id, i) {
      await this.$apiClient.call(process.env.API_HOST_SOCKET +
        `/delete/room/${id}`, {
        method: 'DELETE'
      })

      this.removeRoomByIndex(i)

      if (this.selectedRoom && this.selectedRoom._id === id) {
        this.selectedUser = null
        this.selectedRoom = null
      }
    },

    removeRoomByIndex(i) {
      this.roomsList.splice(i, 1)
    },

    async selectUser(user) {
      this.selectedUser = user

      const index = this.roomsList.findIndex(item => !item.isGroup && item.userIds.includes(user.id))

      if (index === -1) {
        const { data } = await this.getRoomInfo(user)

        this.selectRoom(data)
        this.activeChat = null
      } else {
        this.selectRoom(this.roomsList[index])
        this.activeChat = index
      }
    },

    selectRoom(room) {
      if (this.socket.connected) {
        this.selectedUser = this.findUserById(room)[0]
        this.selectedRoom = { ...room, title: room.title.length > 0 ? room.title : this.selectedUser.fullName }

        room.isNewMessages = 0
      }
    },

    findUserById(room) {
      const { user } = this

      return this.users.filter((item) => {
        const roomUsers = room.userIds.filter(userItem => userItem !== user.id)

        return roomUsers.includes(item.id)
      })
    },

    getRoomInfo(user) {
      return this.$apiClient.call(process.env.API_HOST_SOCKET + '/room/initiate', {
        method: 'POST',
        body: JSON.stringify({ userIds: [this.user.id, user.id] }),
        headers: this.$apiClient.headersJson
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
