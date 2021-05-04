<template>
  <div>
    <v-card>
      <v-card-text class="journal-of-payment-docs-card-text">
        <v-container
          class="journal-of-payment-docs-container"
        >
          <journalOfPaymentDocumentHeader />
          <journalOfPaymentDocumentsTables />
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import JournalOfPaymentDocumentHeader from './components/Header'
import JournalOfPaymentDocumentsTables from './components/DocumentsTables'

export default {
  axiosConfig: {
    auth: {
    }
  },
  name: 'PaymentDocument',
  components: {
    JournalOfPaymentDocumentHeader,
    JournalOfPaymentDocumentsTables
  },
  data() {
    return {}
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {}
  }
}
</script>

<style lang="scss">
.journal-of-payment-docs-card-text{
  padding: 0px;
  max-height: 1000px;
}
.journal-of-payment-docs-container{
  padding-top: 0px;
  padding-right: 0px;
  padding-bottom: 0px;
  max-width: none;
}
</style>
