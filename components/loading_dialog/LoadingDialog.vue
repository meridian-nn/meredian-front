<template>
  <v-dialog
    v-model="loadingDialog"
    persistent
    width="300"
  >
    <v-card
      color="primary"
      dark
    >
      <v-card-text>
        {{ loadingDialogText }}
        <v-progress-linear
          indeterminate
          color="white"
          class="mb-0"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'LoadingDialog',

  data() {
    return {
      loadingDialog: false,
      loadingDialogText: ''
    }
  },

  methods: {
    showLoadingDialog(text) {
      if (!text ||
        this.loadingDialog) {
        return
      }

      this.loadingDialogText = text
      this.loadingDialog = true
    },

    closeLoadingDialog() {
      if (!this.loadingDialog) {
        return
      }
      this.loadingDialog = false
    }
  }
}
</script>
