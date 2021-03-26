<template>
<div>
  Распределение платежей
  <edit-payment-document
    ref="editPaymentDocument"
    @close="close"
    @save="save"
  />
  <v-btn
    color="blue"
    class="mr-2 mb-2"
    @click="newDocument"
  >
    <v-icon>mdi-plus</v-icon>
  </v-btn>
</div>
</template>

<script>
import EditPaymentDocument from '@/views/vcrm/Payment/Modals/EditPaymentDocument'
export default {
  name: 'PaymentDocument',
  components: {
    EditPaymentDocument
  },
  methods: {
    newDocument() {
      this.$refs.editPaymentDocument.newDocument()
    }
  }

}
</script>
