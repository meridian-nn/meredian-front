<template>
  <v-snackbar
    v-model="snackbarUserNotification"
    :timeout="snackbarUserNotificationTimeout"
    :color="snackbarUserNotificationColor"
  >
    {{ snackbarUserNotificationText }}

    <template #action="{ attrs }">
      <v-btn
        v-bind="attrs"
        text
        @click="snackbarUserNotification = false"
      >
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
export default {
  name: 'UserNotification',

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      // Информационное сообщение для пользователя
      snackbarUserNotification: false,
      snackbarUserNotificationTimeout: 3000,
      snackbarUserNotificationColor: '',
      snackbarUserNotificationText: ''
    }
  },
  methods: {
    // Отображение информационного сообщения пользователю
    showUserNotification(color, text, timeout) {
      if (!color ||
      !text) {
        return
      }
      this.snackbarUserNotification = true
      this.snackbarUserNotificationColor = color
      if (timeout) {
        this.snackbarUserNotificationTimeout = timeout
      }
      this.snackbarUserNotificationText = text
    }
  }
}
</script>
