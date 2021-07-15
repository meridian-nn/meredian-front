<template>
  <v-dialog
    :value="show"
    max-width="400px"
    @input="$emit('close')"
  >
    <form @submit.prevent="submit">
      <v-card>
        <v-card-title class="headline">
          Создание групповой комнаты
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="form.title"
                  label="Название комнаты"
                />
              </v-col>

              <v-col cols="12">
                <v-autocomplete
                  v-model="form.userIds"
                  :items="users"
                  chips
                  small-chips
                  label="Пользователи"
                  item-text="fullName"
                  item-value="id"
                  multiple
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            type="submit"
          >
            Создать
          </v-btn>

          <v-btn
            color="blue darken-1"
            text
            @click="$emit('close')"
          >
            Отмена
          </v-btn>

          <v-spacer />
        </v-card-actions>
      </v-card>
    </form>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalCreateGroupRoom',

  props: {
    show: {
      type: Boolean,
      default: false
    },

    users: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      form: {
        title: '',
        userIds: []
      }
    }
  },

  computed: {
    user() {
      return this.$store.state.profile.user
    }
  },

  methods: {
    async submit() {
      try {
        const { room } = await this.$apiClient.call(process.env.API_HOST_SOCKET + '/room/group/create', {
          method: 'POST',
          body: JSON.stringify({ ...this.form, userIds: [...this.form.userIds, this.user.id], ownerId: this.user.id }),
          headers: this.$apiClient.headersJson
        })

        this.$emit('success', room)
        this.$emit('close')
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss">

</style>
