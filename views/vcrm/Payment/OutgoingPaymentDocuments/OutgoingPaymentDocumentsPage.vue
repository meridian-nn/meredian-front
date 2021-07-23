<template>
  <div class="outgoing-payment-documents-main-div">
    <v-row>
      <v-col cols="2">
        <v-btn
          color="blue"
          class="mt-5"
          fab
          dark
          x-small
          data-title="Создание нового исходящего документа"
          @click="newOutgoingDocument"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </v-col>
      <v-spacer />
      <v-col cols="4">
        <div class="outgoing-payment-main">
          <button
            class="budget-btn"
            @click="generateBudget"
          >
            Сформировать бюджет
          </button>
        </div>
      </v-col>
    </v-row>

    <div id="outgoing-payment-documents-table">
      <v-data-table
        :headers="headers"
        height="620"
        fixed-header
        item-key="id"
        :items="outgoingDocuments"
        :show-select="false"
        :single-select="false"
        hide-default-footer
        no-data-text=""
        class="elevation-1"
      >
      </v-data-table>
    </div>

    <div class="outgoing-payment-documents-row mt-3">
      <p class="pt-2">
        Итого
      </p>
      <div class="outgoing-payment-documents-summ-results" />

      <p class="pt-2">
        <vue-numeric
          v-model="totalToSum"
          separator="space"
          :precision="2"
          decimal-separator="."
          output-type="number"
          :read-only="true"
        />
      </p>

      <div class="outgoing-payment-documents-summ-results" />

      <p class="mr-3 pt-2">
        Соисполнитель:
      </p>
      <div style="min-width: 500px;">
        <v-text-field
          v-model="collaborator"
          class="pt-0"
          readonly
        />
      </div>
    </div>

    <div class="outgoing-payment-documents-row mt-5">
      <p class="mr-3 pt-2">
        Назначение:
      </p>
      <v-text-field
        v-model="appointment"
        class="pt-0"
        readonly
      />
    </div>
    <user-notification ref="userNotification" />
    <create-outgoing-payment-document
      ref="createOutgoingPaymentDocument"
      @save="saveOutgoingDocument"
    />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import createOutgoingPaymentDocument from '@/views/vcrm/Payment/OutgoingPaymentDocuments/Modals/CreateOutgoingPaymentDocumentsPage.vue'

export default {
  name: 'OutgoingPaymentDocuments',
  components: {
    UserNotification,
    createOutgoingPaymentDocument
  },
  data() {
    return {
      outgoingDocuments: [],
      headers: [
        {
          text: 'Дескр',
          value: 'descr',
          width: '4%'
        },
        {
          text: 'Выписан',
          value: 'released',
          width: '6%'
        },
        {
          text: 'Номер',
          value: 'num',
          width: '10%'
        },
        {
          text: 'Сумма ',
          value: 'summ',
          width: '10%'
        },
        {
          text: 'Плательщик',
          value: 'payer',
          width: '7%'
        },
        {
          text: 'Получатель',
          value: 'recipient',
          width: '13%'
        },
        {
          text: 'Испольнитель',
          value: 'executor',
          width: '7%'
        },
        {
          text: '№ вып.',
          value: 'numExtract',
          width: '5%'
        },
        {
          text: 'Комментарий',
          value: 'comment',
          width: '12%'
        },
        {
          text: 'Код элемента',
          value: 'codeElmt',
          width: '7%'
        },
        {
          text: 'Элемент',
          value: 'elmt',
          width: '10%'
        },
        {
          text: 'ЦФО',
          value: 'cfo',
          width: '8%'
        }
      ],
      totalToSum: 0,
      collaborator: null,
      appointment: null
    }
  },

  methods: {
    generateBudget() {
      this.$refs.userNotification.showUserNotification('success', 'Бюджет сформирован')
    },
    newOutgoingDocument() {
      this.$refs.createOutgoingPaymentDocument.newDocument()
    },
    saveOutgoingDocument() {
      this.$refs.userNotification.showUserNotification('success', 'Новый исходящий платежный документ добавлен')
    }
  }
}
</script>

<style lang="scss">
.outgoing-payment-documents-main-div {
  padding: 10px;
}

.outgoing-payment-main {
  display: flex;
  justify-content: flex-end;
}

.budget-btn {
  width: max-content;
  height: auto;
  font-size: 1rem;
  background: #639db1;
  border: none;
  margin: 20px;
  outline: 2px solid #639db1;
  outline-offset: 4px;
  border: 2px solid #639db1;
  cursor: pointer;
  color: white;
  transition: all 250ms;
  padding: 4px;
}

.budget-btn:hover {
  outline-offset: -4px;
  color: rgb(34, 34, 34);
  background: none;
}

.outgoing-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

#outgoing-payment-documents-table {
  border-collapse: collapse;
  width: 100%;
}

#outgoing-payment-documents-table table {
  width: 100%;
}

#outgoing-payment-documents-table td, #outgoing-payment-documents-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 !important;
  height: 0 !important;
}

#outgoing-payment-documents-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

#outgoing-payment-documents-table tr:hover {
  background-color: #ddd;
}

#outgoing-payment-documents-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.outgoing-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
}

.outgoing-payment-documents-summ-results {
  flex: 0 0 18%;
  max-width: 18%;
}

.outgoing-payment-documents-row p {
  font-weight: bold;
}
</style>
