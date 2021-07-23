<template>
  <div class="outgoing-payment-documents-main-div">
    <v-row>
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
        height="650"
        fixed-header
        :items="outgoingDocuments"
        :show-select="false"
        hide-default-footer
        class="elevation-1"
      >
        <template #body="{ items }">
          <tbody>
            <tr
              v-for="(item, index) in items"
              :key="item + index"
              @contextmenu="showContextMenu($event, item)"
              :value="item"
            >
              <td style="width: 4% !important;">
                {{ item.test[0] }}
              </td>
              <td style="width: 6% !important;">
                {{ item.test[1] }}
              </td>
              <td style="width: 10% !important;">
                {{ item.test[2] }}
              </td>
              <td style="width: 10% !important;">
                {{ item.test[3] }}
              </td>
              <td style="width: 7% !important;">
                {{ item.test[4] }}
              </td>
              <td style="width: 13% !important;">
                {{ item.test[5] }}
              </td>
              <td style="width: 7% !important;">
                {{ item.test[6] }}
              </td>
              <td style="width: 5% !important;">
                {{ item.test[7] }}
              </td>
              <td style="width: 12% !important;">
                {{ item.test[8] }}
              </td>
              <td style="width: 7% !important;">
                {{ item.test[9] }}
              </td>
              <td style="width: 10% !important;">
                {{ item.test[10] }}
              </td>
              <td style="width: 8% !important;">
                {{ item.test[11] }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-data-table>
    </div>

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
    <profile-of-contractor ref="profileOfContractor" />
  </div>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'
import ProfileOfContractor from '@/views/vcrm/Payment/ProfileOfContractor/ProfileOfContractorPage'

export default {
  name: 'OutgoingPaymentDocuments',
  components: {
    UserNotification,
    ProfileOfContractor
  },
  data() {
    return {
      outgoingDocuments: [
        {
          test: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12']
        },
        {
          test: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12']
        },
        {
          test: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12']
        },
        {
          test: ['test1', 'test2', 'test3', 'test4', 'test5', 'test6', 'test7', 'test8', 'test9', 'test10', 'test11', 'test12']
        }
      ],
      headers: [
        {
          text: 'Дескр',
          value: 'descr'
        },
        {
          text: 'Выписан',
          value: 'released'
        },
        {
          text: 'Номер',
          value: 'num'
        },
        {
          text: 'Сумма ',
          value: 'summ'
        },
        {
          text: 'Плательщик',
          value: 'payer'
        },
        {
          text: 'Получатель',
          value: 'recipient'
        },
        {
          text: 'Испольнитель',
          value: 'executor'
        },
        {
          text: '№ вып.',
          value: 'numExtract'
        },
        {
          text: 'Комментарий',
          value: 'comment'
        },
        {
          text: 'Код элемента',
          value: 'codeElmt'
        },
        {
          text: 'Элемент',
          value: 'elmt'
        },
        {
          text: 'ЦФО',
          value: 'cfo'
        }
      ],
      totalToSum: 0,
      collaborator: null,
      appointment: null,
      rightClickMenu: false,
      xRightClickMenu: 0,
      yRightClickMenu: 0,
      currentRowOfTableForContextMenu: null
    }
  },

  methods: {
    generateBudget() {
      this.$refs.userNotification.showUserNotification('success', 'Бюджет сформирован')
    },

    showContextMenu(event, item) {
      event.preventDefault()
      this.rightClickMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xRightClickMenu = event.clientX
      this.yRightClickMenu = event.clientY
      this.$nextTick(() => {
        this.rightClickMenu = true
        this.currentRowOfTableForContextMenu = item.test
      })
    },

    profileOfContractorOpenForm() {
      this.$refs.profileOfContractor.openForm(this.currentRowOfTableForContextMenu)
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
  padding: 0 0 !important;
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

.outgoing-payment-documents-summ-results {
  flex: 0 0 18%;
  max-width: 18%;
}

.outgoing-payment-documents-row p {
  font-weight: bold;
}
</style>
