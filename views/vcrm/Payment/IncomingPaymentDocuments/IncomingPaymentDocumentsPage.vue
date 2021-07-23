<template>
  <div class="incoming-payment-documents-main-div">
    <v-btn
      color="blue"
      class="my-3"
      fab
      dark
      x-small
      data-title="Создание нового входящего платежного документа"
      @click="newIncomingDocument"
    >
      <v-icon dark>
        mdi-plus
      </v-icon>
    </v-btn>
    <div class="incoming-payment-documents-row">
      <v-data-table
        id="incoming-payment-documents-data-table"
        v-model="dataTableSelectedRows"
        :headers="dataTableHeaders"
        fixed-header
        :items="dataTableItems"
        height="690"
        item-key="id"
        :show-select="true"
        :single-select="false"
        disable-pagination
        hide-default-footer
        no-data-text=""
        class="elevation-1"
        @contextmenu:row="showContextMenu"
      />
      <v-menu
        v-model="rightClickMenu"
        :position-x="xRightClickMenu"
        :position-y="yRightClickMenu"
        absolute
        offset-y
      >
        <v-list>
          <v-list-item @click="profileOfContractorOpenForm">
            <v-list-item-title>
              Карточка контрагента
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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
          dense
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
          dense
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
          dense
        />
      </div>
    </div>

    <user-notification ref="userNotification" />
    <profile-of-contractor ref="profileOfContractor" />

    <create-incoming-payment-document
      ref="createIncomingPaymentDocument"
      @save="saveIncomingDocument"
    />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import ProfileOfContractor from '@/views/vcrm/Payment/ProfileOfContractor/ProfileOfContractorPage'
import createIncomingPaymentDocument from '@/views/vcrm/Payment/IncomingPaymentDocuments/Modal/CreateIncomingPaymentDocument.vue'

export default {
  name: 'IncomingPaymentDocumentsPage',

  components: {
    UserNotification,
    ProfileOfContractor,
    createIncomingPaymentDocument
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
      dataTableItems: [
        {
          id: 1,
          descr: 'test1',
          dataVipis: 'test1',
          numFind: 'test1',
          sumFind: 'test1',
          platName: 'test1',
          poluchName: 'test1',
          fio: 'test1',
          numOfDoc: 'test1',
          comment: 'test1',
          bud_celem: 'test1',
          bud_nelem: 'test1',
          bud_ncfo: 'test1'
        },
        {
          id: 2,
          descr: 'test2',
          dataVipis: 'test2',
          numFind: 'test2',
          sumFind: 'test2',
          platName: 'test2',
          poluchName: 'test2',
          fio: 'test2',
          numOfDoc: 'test2',
          comment: 'test2',
          bud_celem: 'test2',
          bud_nelem: 'test2',
          bud_ncfo: 'test2'
        },
        {
          id: 3,
          descr: 'test3',
          dataVipis: 'test3',
          numFind: 'test3',
          sumFind: 'test3',
          platName: 'test3',
          poluchName: 'test3',
          fio: 'test3',
          numOfDoc: 'test3',
          comment: 'test3',
          bud_celem: 'test3',
          bud_nelem: 'test3',
          bud_ncfo: 'test3'
        }
      ],

      sumOfDataTableItems: 0,

      coExecutor: '',

      purpose: '',

      rightClickMenu: false,
      xRightClickMenu: 0,
      yRightClickMenu: 0,
      currentRowOfTableForContextMenu: null
    }
  },

  methods: {
    showContextMenu(event, item) {
      event.preventDefault()
      this.rightClickMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xRightClickMenu = event.clientX
      this.yRightClickMenu = event.clientY
      this.$nextTick(() => {
        this.rightClickMenu = true
        this.currentRowOfTableForContextMenu = item.item
      })
    },

    profileOfContractorOpenForm() {
      this.$refs.profileOfContractor.openForm(this.currentRowOfTableForContextMenu)
    },
    newIncomingDocument() {
      this.$refs.createIncomingPaymentDocument.newDocument()
    },
    saveIncomingDocument() {
      this.$refs.userNotification.showUserNotification('success', 'Новый входящий документ добавлен')
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
  height: 690px;
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
