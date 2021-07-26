<template>
  <v-dialog
    :value="show"
    max-width="600px"
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
          @click="cancel"
        >
          Отмена
        </v-btn>

        <v-btn
          color="blue darken-1"
          text
          @click="success"
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
  name: 'ModalConfirm'
}
</script>

<style lang="scss" scoped>

</style>
