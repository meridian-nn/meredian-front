<template>
  <div class="incoming-payment-documents-main-div">
    <div class="incoming-payment-documents-row">
      <v-data-table
        id="incoming-payment-documents-data-table"
        v-model="dataTableSelectedRows"
        :headers="dataTableHeaders"
        fixed-header
        :items="dataTableItems"
        height="740"
        item-key="id"
        :show-select="true"
        :single-select="false"
        disable-pagination
        hide-default-footer
        no-data-text=""
        class="elevation-1"
      />
    </div>

    <div class="incoming-payment-documents-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Итого:
      </v-subheader>

      <div class="incoming-payment-documents-sum-data-field">
        <v-text-field
          v-model.number="sumOfDataTableItems"
          hide-details="auto"
          :readonly="true"
          outlined
        />
      </div>

      <v-subheader class="font-weight-medium text-subtitle-1">
        Соисполнитель:
      </v-subheader>

      <div class="incoming-payment-documents-co-executor-field">
        <v-text-field
          v-model.number="coExecutor"
          hide-details="auto"
          height="20"
          :readonly="true"
          outlined
        />
      </div>
    </div>

    <div class="incoming-payment-documents-row">
      <v-subheader class="font-weight-medium text-subtitle-1">
        Назначение:
      </v-subheader>

      <div class="incoming-payment-documents-purpose-field">
        <v-text-field
          v-model.number="purpose"
          hide-details="auto"
          :readonly="true"
          outlined
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'

export default {
  name: 'IncomingPaymentDocumentsPage',

  components: {
    UserNotification
  },

  data() {
    return {
      dataTableSelectedRows: [],
      dataTableHeaders: [
        {
          text: 'Дескр',
          value: 'descr',
          width: '60px'
        },
        {
          text: 'Выписан',
          value: 'dataVipis',
          width: '60px'
        },
        {
          text: 'Номер',
          value: 'numFind',
          width: '60px'
        },
        {
          text: 'Сумма',
          value: 'sumFind',
          width: '60px'
        },
        {
          text: 'Плательщик',
          value: 'platName',
          width: '60px'
        },
        {
          text: 'Получатель',
          value: 'poluchName',
          width: '60px'
        },
        {
          text: 'Исполнитель',
          value: 'fio',
          width: '60px'
        },
        {
          text: '№ вып',
          value: 'numOfDoc',
          width: '60px'
        },
        {
          text: 'Комментарий',
          value: 'comment',
          width: '60px'
        },
        {
          text: 'Код элем.',
          value: 'bud_celem',
          width: '60px'
        },
        {
          text: 'Элемент',
          value: 'bud_nelem',
          width: '60px'
        },
        {
          text: 'ЦФО',
          value: 'bud_ncfo',
          width: '60px'
        }
      ],
      dataTableItems: [],

      sumOfDataTableItems: 0,

      coExecutor: '',

      purpose: ''
    }
  }
}
</script>

<style lang="scss">
.incoming-payment-documents-main-div {
  padding: 10px
}

.incoming-payment-documents-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin-bottom: 10px;
  min-width: 100%;
}

.incoming-payment-documents-sum-data-field {
  width: 250px;
  margin-right: 20px;
}

.incoming-payment-documents-co-executor-field {
  width: 250px;
}

#incoming-payment-documents-data-table {
  border-collapse: collapse;
  width: 100%;
  height: 740px;
}

#incoming-payment-documents-data-table table {
  width: 100%;
}

#incoming-payment-documents-data-table td, #incoming-payment-documents-data-table th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#incoming-payment-documents-data-table th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.incoming-payment-documents-purpose-field {
  width: 90%;
}
</style>
