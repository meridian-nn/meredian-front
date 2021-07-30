<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      width="1000"
    >
      <v-card>
        <v-card-text>
          {{ messageText }}
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            text
            @click="dialog = false"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'Message',

  data() {
    return {
      messageText: '',
      dialog: false
    }
  },

  methods: {
    showMessageToUser(messageText) {
      if (!messageText) {
        return
      }

      this.messageText = messageText
      this.dialog = true
    }
  }
}
</script>
