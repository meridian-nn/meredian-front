<template>
  <div class="payment-document-page">
    <v-tabs>
      <v-tab>Реестр оплат</v-tab>

      <v-tab>Платежи</v-tab>
    </v-tabs>

    <v-tabs-items>
      <v-tab-item>
        Реестр оплат
      </v-tab-item>

      <v-tab-item>
        Платежи
      </v-tab-item>
    </v-tabs-items>

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
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'
export default {
  name: 'PaymentDocument',
  components: {
    EditPaymentDocument
  },
  methods: {
    newDocument() {
      this.$refs.editPaymentDocument.newDocument()
    }
  },
  computed: {
    headers() {
      return [
        {
          text: 'Gtin',
          value: 'code',
          width: '150px',
          sortable: false
        }
      ]
    }
  }

}
</script>
