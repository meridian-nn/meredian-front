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
          height="500"
        >
          <v-list subheader>
            <v-list-item-group v-model="activeChat">
              <template v-for="(item, index) in users">
                <v-list-item
                  :key="`parent${index}`"
                  :value="item.id"
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

                  <v-list-item-icon>
                    <v-icon :color="item.active ? 'deep-purple accent-4' : 'grey'">
                      mdi-message-bulleted
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
      </v-col>

      <v-col
        cols="auto"
        class="flex-grow-1 flex-shrink-0"
      >
        <chat-room
          :active-chat="activeChat"
          :message-to="selectedUser"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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

    return { userList: users, roomsList: rooms }
  },

  data: () => ({
    activeChat: null,
    selectedUser: {}
  }),

  computed: {
    user() {
      return this.$store.state.profile.user
    },

    users() {
      const { user } = this

      return this.userList.filter(item => item.id !== user.id)
    }
  },

  methods: {
    selectUser(user) {
      this.selectedUser = user
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
