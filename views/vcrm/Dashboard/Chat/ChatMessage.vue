<template>
  <div :class="{ 'd-flex flex-row-reverse': isMy }">
    <v-menu offset-y>
      <template #activator="{ on }">
        <v-hover v-slot="{ hover }">
          <v-chip
            :color="msg.me ? 'primary' : ''"
            dark
            style="height:auto;white-space: normal;"
            class="pa-4 mb-2"
            v-on="on"
          >
            {{ msg.message }}
            <sub
              style="font-size: 0.5rem;"
            >{{ msg.createdAt | formatDate('DD.MM.YYYY HH:MM') }}</sub>

            <v-icon
              v-if="hover && isMy"
              small
            >
              mdi-chevron-down
            </v-icon>
          </v-chip>
        </v-hover>
      </template>

      <v-list>
        <v-list-item @click="$emit('removeMessage', msg._id)">
          <v-list-item-title>Удалить</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<script>
export default {
  name: 'ChatMessage',

  props: {
    isMy: {
      type: Boolean,
      default: false
    },

    msg: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang='scss'>

</style>
