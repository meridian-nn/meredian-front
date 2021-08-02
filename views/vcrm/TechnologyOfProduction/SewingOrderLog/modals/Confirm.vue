<template>
  <v-dialog
    :value="value"
    max-width="500px"
  >
    <v-card>
      <v-card-title class="headline">
        Вы действительно хотите удалить?
      </v-card-title>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="$emit('close')"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="$emit('success')"
        >
          OK
        </v-btn>

        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ModalConfirm',

  props: {
    value: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
