<template>
  <div class="payment-document-page">
    <v-data-table
      :headers="headers"
      :items="documentList"
      sort-by="calories"
      calculate-widths
    >
    </v-data-table>

    <edit-payment-document ref="editPaymentDocument" />
  </div>
</template>

<script>
import EditPaymentDocument from '@/views/payment/PaymentDocument/Modals/EditPaymentDocument'
export default {
  name: 'PaymentDocument',
  components: {
    EditPaymentDocument
  },

  async fetch() {
    this.documentList = await this.$axios.$get('http://192.168.1.70:9037/meridian/oper/dict/spViddocopl/findDepartments')
  },
  data() {
    return {
      axiosConfig: {
        auth: {
          username: 'admin',
          password: 'Wtrkop45'
        },
        baseURL: 'http://192.168.1.70:9037/meridian',
        proxy: true,
        credentials: false,
        mode: 'no-cors'
      },
      documentList: []
    }
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
