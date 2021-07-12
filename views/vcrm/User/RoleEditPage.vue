<template>
  <div class="role-edit-page">
    <v-expansion-panels accordion>
      <v-expansion-panel
        v-for="(role, i) in roles"
        :key="i"
      >
        <v-expansion-panel-header>
          <div class="subtitle-1">
            {{ role.name }}
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <v-virtual-scroll
            :items="privileges"
            height="300"
            item-height="24"
          >
            <template #default="{ item }">
              <v-checkbox
                v-model="role.privileges"
                :label="item.description"
                :value="item.id"
                @change="saveRolePrivileges(privilegesObject[i])"
              />
            </template>
          </v-virtual-scroll>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
export default {
  name: 'RoleEditPage',

  components: {
    UserNotification
  },

  async asyncData({ $api }) {
    const [roles, privileges] = await Promise.all([
      $api.auth.role.get(),
      $api.auth.privilege.get()
    ])

    return { roles, privileges }
  },

  computed: {
    privilegesObject() {
      return this.roles.map((e) => {
        return {
          ...e,
          privileges: e.privileges.map((i) => {
            return { id: i }
          }),
          users: e.users.map((i) => {
            return { id: i }
          })
        }
      })
    }
  },

  methods: {
    saveRolePrivileges(roles) {
      try {
        this.$api.auth.role.save(roles)
      } catch (e) {
        this.$refs.userNotification.showUserNotification('error', 'Ошибка сервера. Поробуйте позже')
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss">
.role-edit-page {
  padding: 20px 120px 20px 20px;

  .v-input--selection-controls {
    margin-top: 0 !important;
  }

  .v-input__slot {
    margin-bottom: 0;
  }
}
</style>
