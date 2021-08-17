<template>
  <v-dialog
    v-model="dialog"
    :object-for-edit="orderFromRecordsOfWorkByCards"
    width="1900px"
    :fullscreen="true"
    padding="0px"
    persistent
    class="records-of-work-on-order-main-div"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        Запись работы по заказу
      </v-card-title>

      <div class="records-of-work-on-order-row">
        <div class="records-of-work-on-order-label">
          <v-subheader class="font-weight-medium text-subtitle-1">
            Месяц
          </v-subheader>
        </div>

        <div class="records-of-work-on-order-autocomplete-month">
          <v-text-field
            v-model.number="chosenMonth"
            hide-details="auto"
            :readonly="true"
            outlined
          />
        </div>

        <div class="records-of-work-on-order-label">
          <v-subheader class="font-weight-medium text-subtitle-1">
            Год
          </v-subheader>
        </div>

        <div class="records-of-work-on-order-autocomplete-year">
          <v-text-field
            v-model.number="chosenYear"
            hide-details="auto"
            :readonly="true"
            outlined
          />
        </div>

        <div class="records-of-work-on-order-label">
          <v-subheader class="font-weight-medium text-subtitle-1">
            Производство:
          </v-subheader>
        </div>

        <div class="records-of-work-on-order-autocomplete-organizations">
          <v-text-field
            v-model.number="chosenOrg"
            hide-details="auto"
            :readonly="true"
            outlined
          />
        </div>
      </div>

      <div class="records-of-work-on-order-row">
        <div class="records-of-work-on-order-col-4">
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                № заказа
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-indentation-for-inputs">
              <v-text-field
                v-model.number="chosenRecord.numZkzpsv"
                readonly
                hide-details="auto"
              />
            </div>

            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                № заявки
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-indentation-for-inputs">
              <v-text-field
                v-model.number="chosenRecord.numZaivk"
                readonly
                hide-details="auto"
              />
            </div>
          </div>

          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Кол-во изделий:
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-indentation-for-inputs">
              <v-text-field
                v-model.number="chosenRecord.colvoMc"
                readonly
                hide-details="auto"
              />
            </div>

            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Коэффициент:
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-coefficient-input">
              <v-text-field
                v-model.number="chosenRecord.coeff"
                readonly
                hide-details="auto"
              />
            </div>
          </div>

          <div class="records-of-work-on-order-btn-row">
            <div class="records-of-work-on-order-btn">
              <v-btn>
                Сформировать карточки
              </v-btn>
            </div>

            <div class="records-of-work-on-order-btn">
              <v-btn>
                Удалить карточки
              </v-btn>
            </div>
          </div>
        </div>

        <div class="records-of-work-on-order-col-5">
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                Код изделия:
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-indentation-for-inputs">
              <v-text-field
                v-model.number="chosenRecord.coeff"
                readonly
                hide-details="auto"
                outlined
              />
            </div>

            <div class="records-of-work-on-order-descr-of-production-input">
              <v-text-field
                v-model.number="chosenRecord.nameMc"
                readonly
                hide-details="auto"
                outlined
              />
            </div>
          </div>

          <div class="records-of-work-on-order-row">
            <v-simple-checkbox
              v-model="example"
            />

            <v-subheader
              class="font-weight-medium text-subtitle-1"
              style="margin-top: 10px"
            >
              Образец
            </v-subheader>

            <v-subheader
              class="font-weight-medium text-subtitle-1"
              style="margin-top: 10px"
            >
              Дата опер.
            </v-subheader>
            <div>
              <v-text-field
                v-model="dateOfOperation"
                type="date"
              />
            </div>

            <div
              class="records-of-work-on-order-amount-of-change-label"
            >
              <v-subheader
                class="font-weight-medium text-subtitle-1"
                style="margin-top: 5px"
              >
                Изменить во всех операциях
              </v-subheader>
            </div>

            <div
              class="records-of-work-on-order-amount-of-change-input"
            >
              <v-text-field
                v-model.number="amountOfChange"
                hide-details="auto"
                outlined
              />
            </div>
          </div>
        </div>

        <div class="records-of-work-on-order-col-3">
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-label">
              <v-subheader class="font-weight-medium text-subtitle-1">
                ТП:
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-tpid-input">
              <v-text-field
                v-model.number="chosenRecord.posledCode"
                readonly
                hide-details="auto"
                outlined
              />
            </div>

            <div class="records-of-work-on-order-tpname-input">
              <v-text-field
                v-model.number="chosenRecord.modelName"
                readonly
                hide-details="auto"
                outlined
              />
            </div>
          </div>

          <div class="records-of-work-on-order-row">
            <div
              class="records-of-work-on-separation-scheme-label"
            >
              <v-subheader
                class="font-weight-medium text-subtitle-1"
              >
                Схема разделения:
              </v-subheader>
            </div>

            <div class="records-of-work-on-order-autocomplete-separation-scheme">
              <v-autocomplete
                v-model="chosenSeparationScheme"
                :loading="loadingType.separationScheme"
                :items="separationScheme"
                auto-select-first
                item-value="id"
                item-text="nameScheme"
                hide-details="auto"
                outlined
                @change="separationSchemeChange"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="records-of-work-on-order-row">
        <div class="records-of-work-on-order-org-operations-table-col-4">
          <div
            class="records-of-work-on-order-row"
            style="margin-bottom: 20px"
          >
            <v-data-table
              id="records-of-work-on-order-org-operations"
              height="400"
              :headers="orgOperationsHeaders"
              fixed-header
              :items="orgOperationsData"
              :show-select="false"
              :single-select="false"
              disable-pagination
              hide-default-footer
              no-data-text=""
              class="elevation-1"
              @click:row="getDressMakersDataTable"
            />
          </div>

          <div class="records-of-work-on-order-row">
            <v-data-table
              id="records-of-work-on-order-operations"
              height="200"
              :headers="operationsSumsHeaders"
              fixed-header
              :items="operationsSumsData"
              :show-select="false"
              :single-select="false"
              disable-pagination
              hide-default-footer
              no-data-text=""
              class="elevation-1"
            />
          </div>
        </div>

        <div class="records-of-work-on-order-dressmakers-and-operations-col-5">
          <v-data-table
            id="records-of-work-on-order-dressmakers-and-operations"
            height="620"
            :headers="dressmakersHeaders"
            fixed-header
            :items="dressmakersData"
            :item-key="'id' + 'codOp'"
            :show-select="false"
            :single-select="false"
            disable-pagination
            hide-default-footer
            class="elevation-1"
          />
        </div>

        <div class="records-of-work-on-order-col-3">
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-list-of-dressmakers-headers-spacer" />
            <div class="records-of-work-on-order-list-of-dressmakers-headers">
              <div class="records-of-work-on-order-row">
                <div
                  style="margin-top:5px"
                >
                  <v-btn
                    color="blue"
                    class="mx-2"
                    fab
                    dark
                    x-small
                  >
                    <v-icon dark>
                      mdi-minus
                    </v-icon>
                  </v-btn>
                </div>
                <v-subheader
                  class="font-weight-medium text-subtitle-1"
                >
                  Список швей
                </v-subheader>
              </div>
            </div>
          </div>
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-left-arrow">
              <v-btn
                color="blue"
                class="mr-2 mb-2"
                fab
                dark
                small
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </div>
            <div class="records-of-work-on-order-dressmakers-div">
              <v-data-table
                id="records-of-work-on-order-dressmakers"
                height="572"
                :headers="listOfDressmakersHeaders"
                fixed-header
                :items="listOfDressmakersData"
                :show-select="false"
                :single-select="false"
                disable-pagination
                hide-default-footer
                class="elevation-1"
                @update:sort-by="updateSortListDressmaker('by', $event)"
                @update:sort-desc="updateSortListDressmaker('desc', $event)"
              />
            </div>
          </div>
        </div>
      </div>

      <user-notification ref="userNotification" />

      <div class="records-of-work-on-order-row">
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="close"
        >
          Закрыть
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>
<script>
import UserNotification from '~/components/information_window/UserNotification'

export default {
  name: 'RecordsOfWorkOnOrder',

  components: {
    UserNotification
  },

  props: {
    show: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loadingType: {
        listOfDressmakersData: false
      },

      keyLoading: Math.random(),

      infiniteIdOfListOfDressmakersData: 0,

      pageOfRecordsListDressmaker: 0,

      sortBy: [],

      months: [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
      ],

      chosenMonth: {},

      years: [],

      chosenYear: {},

      chosenOrg: {},

      // массив организаций
      organizations: [],

      numberOfOrder: '',

      numberOfApplication: '',

      countOfProductions: 0,

      coefficient: 0,

      TPid: null,

      TPname: '',

      separationScheme: [],

      chosenSeparationScheme: {},

      codeOfProduction: null,

      descrOfProduction: null,

      example: false,

      dateOfOperation: new Date().toISOString().substr(0, 10),

      amountOfChange: 0,

      orgOperationsHeaders: [
        {
          text: 'Цех',
          value: 'cehNum'
        },
        {
          text: 'Орг. операция',
          value: 'operName'
        }
      ],

      orgOperationsData: [],

      operationsSumsHeaders: [
        {
          text: 'Операция',
          value: 'operation'
        },
        {
          text: 'Кол-во',
          value: 'count'
        },
        {
          text: 'Всего',
          value: 'amount'
        },
        {
          text: 'Остаток',
          value: 'balance'
        }
      ],

      operationsSumsData: [],

      dressmakersHeaders: [
        {
          text: 'Таб. номер',
          value: 'tabN'
        },
        {
          text: 'ФИО',
          value: 'fio'
        },
        {
          text: 'Код операции',
          value: 'codOp'
        },
        {
          text: 'Кол-во',
          value: 'colvoOp'
        },
        {
          text: '+/-',
          value: 'colvoNew'
        },
        {
          text: 'Всего',
          value: 'colvoOst' // нет в респонсе
        }
      ],

      dressmakersData: [],

      listOfDressmakersHeaders: [
        {
          text: 'Таб. номер',
          value: 'tabN'
        },
        {
          text: 'ФИО',
          value: 'fio'
        },
        {
          text: 'Бригада',
          value: 'ur2Name'
        }
      ],

      listOfDressmakersData: [],

      dialog: false,

      orderFromRecordsOfWorkByCards: {},

      chosenRecord: {},

      varsOfForm: {
        orgAnfb: null,
        orgName: null,
        proizvAnfb: null,
        mesAnfb: null,
        godAnfb: null
      },

      orgOperation: [],

      recordedWork: [],

      monthOfProizv: {},

      selectedSeparationSchemeObj: {}
    }
  },
  computed: {
    handleSortData() {
      const { sortDesc } = this
      return this.sortBy.map((item, i) => {
        return {
          'direction': sortDesc[i] ? 'ASC' : 'DESC',
          'property': item
        }
      })
    }
  },
  methods: {
    updateSortListDressmaker(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
    },

    async openWithObject(order, varsOfForm, chosenRecord) {
      if (!order) {
        return
      }

      this.chosenRecord = chosenRecord
      this.orderFromRecordsOfWorkByCards = order
      this.varsOfForm = varsOfForm
      this.chosenMonth = this.varsOfForm.mesAnfb
      this.chosenYear = this.varsOfForm.godAnfb
      this.chosenOrg = this.varsOfForm.orgName
      this.dialog = true

      await this.initSeparationScheme()
      await this.updateSeparationScheme()
      this.selectSeparationSchemeOfChosenRecord()

      await this.initDataForListOfDressmakersData()
      await this.getListOfDressmakersDataTable()
    },
    close() {
      this.reset()
      this.dialog = false
      this.$emit('close')
    },

    async initOrgOperationData(selectedSeparationShemeObj) {
      const paramsForRequest = {
        proizvId: this.varsOfForm.proizvAnfb,
        monthCurr: this.varsOfForm.mesAnfb,
        yearCurr: this.varsOfForm.godAnfb,
        firmaId: this.varsOfForm.orgAnfb,
        priznak: 2,
        tmkId: this.orderFromRecordsOfWorkByCards.tmkId1,
        zkzpsvId: this.chosenRecord.zkzpsvId,
        schemeCardsId: selectedSeparationShemeObj.schemeCardsId,
        schemeId: selectedSeparationShemeObj.schemeId,
        zarSchCardsId: selectedSeparationShemeObj.zarSchCardsId
      }
      const params = this.createStructureForManufacturingInitDataProcedure(paramsForRequest)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
    },

    async updateOrgOperationsData() {
      const criterias = [
        {
          dataType: 'VARCHAR',
          key: 'userId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            this.getCurrentUser.id
          ]
        }
      ]
      this.orgOperationsData = await this.$api.manufacturing.findOrgOperationsBySearchCriterias(criterias)
    },

    async selectOrgOperationEvent(selectedRow) {
      /* await this.initOperationsSumsData(selectedRow.orgOperId)
      await this.updateOperationsSumsData() */
    },

    async initOperationsSumsData(orgOperId) {
      const paramsForRequest = {
        proizvId: this.varsOfForm.proizvAnfb,
        monthCurr: this.varsOfForm.mesAnfb,
        yearCurr: this.varsOfForm.godAnfb,
        firmaId: this.varsOfForm.orgAnfb,
        priznak: 7,
        tmkId: this.orderFromRecordsOfWorkByCards.tmkId1,
        orgOperId
      }
      const params = this.createStructureForManufacturingInitDataProcedure(paramsForRequest)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
    },

    async updateOperationsSumsData() {
      const criterias = [
        {
          dataType: 'VARCHAR',
          key: 'userId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            this.getCurrentUser.id
          ]
        }
      ]
      this.operationsSumsData = await this.$api.manufacturing.findOperationsSumsBySearchCriterias(criterias)
    },

    async initSeparationScheme() {
      const paramsForRequest = {
        proizvId: this.varsOfForm.proizvAnfb,
        monthCurr: this.varsOfForm.mesAnfb,
        yearCurr: this.varsOfForm.godAnfb,
        firmaId: this.varsOfForm.orgAnfb,
        priznak: 6,
        zkzpsvId: this.chosenRecord.zkzpsvId,
        tmkId: this.orderFromRecordsOfWorkByCards.tmkId1
      }
      const params = this.createStructureForManufacturingInitDataProcedure(paramsForRequest)
      await this.$api.service.executeStashedFunction(params).catch((error) => {
        alert(error)
      })
    },

    async updateSeparationScheme() {
      const criterias = [
        {
          dataType: 'VARCHAR',
          key: 'userId',
          operation: 'EQUALS',
          type: 'AND',
          values: [
            this.getCurrentUser.id
          ]
        }
      ]

      this.separationScheme = await this.$api.manufacturing.findSeparationSchemeBySearchCriterias(criterias)
    },

    selectSeparationSchemeOfChosenRecord() {
      if (!this.separationScheme) {
        return
      }

      const chosenSeparationSchemeObj = this.separationScheme.find(separationScheme => separationScheme.schemeId === this.chosenRecord.schemeId)
      this.chosenSeparationScheme = chosenSeparationSchemeObj.id
      this.separationSchemeChange()
    },

    async separationSchemeChange() {
      this.selectedSeparationSchemeObj = this.separationScheme.find(separationScheme => separationScheme.id === this.chosenSeparationScheme)
      await this.initOrgOperationData(this.selectedSeparationSchemeObj)
      await this.updateOrgOperationsData()
    },

    reset() {
      this.chosenRecord = {}
      this.orderFromRecordsOfWorkByCards = {}
      this.varsOfForm = {
        orgAnfb: null,
        orgName: null,
        proizvAnfb: null,
        mesAnfb: null,
        godAnfb: null
      }
      this.chosenMonth = {}
      this.chosenYear = {}
      this.chosenOrg = {}
      this.orgOperationsData = []
      this.operationsSumsData = []
      this.separationScheme = []
      this.chosenSeparationScheme = {}

      this.listOfDressmakersData = []
      this.dressmakersData = []
    },

    async initDataForListOfDressmakersData() {
      const dataForGetParams = { ...this.orderFromRecordsOfWorkByCards, ...this.varsOfForm }
      const paramsForInit = this.createStructureForListOfDressmakersInitDataProcedure(dataForGetParams)

      await this.$api.service.executeStashedFunction(paramsForInit).catch((error) => {
        alert(error)
      })
    },

    async getListOfDressmakersDataTable() {
      const searchCriterias = this.createCriteriasToGetListOfDressmakers()
      const content = await this.$api.manufacturing.recordingTheWorkOnTheOrder.findBySearchCriteriaForListOfDressmaker(searchCriterias)

      if (content.length > 0) {
        this.listOfDressmakersData.push(...content)
      }
    },

    async initDataMakers(item) {
      this.dressmakersData = []
      const dataForParams = {
        ...this.chosenRecord,
        ...item,
        ...this.varsOfForm,
        ...this.orderFromRecordsOfWorkByCards,
        ...this.selectedSeparationSchemeObj
      }
      const paramsForInit = this.createStructureForDressMakersInitDataProcedure(dataForParams)
      await this.$api.service.executeStashedFunction(paramsForInit).catch((error) => {
        alert(error)
      })
    },

    async getDressMakersDataTable(item) {
      await this.initDataMakers(item)

      const searchCriterias = this.createCriteriasToGetDressMakers()

      const content = await this.$api.manufacturing.recordingTheWorkOnTheOrder.findBySearchCriteriaForGetDressmaker(searchCriterias)
      if (content.length > 0) {
        this.dressmakersData.push(...content)
      }
    }
  }
}
</script>

<style lang="scss">
.records-of-work-on-order-main-div {
  margin: 10px;
}

.records-of-work-on-order-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin: 0;
  min-width: 100%;
}

.records-of-work-on-order-btn-row {
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  margin-left: 16px;
  min-width: 100%;
}

.records-of-work-on-order-label {
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-separation-scheme-label {
  margin-right: 10px;
  margin-top: 10px;
  width: 111px;
}

.records-of-work-on-order-amount-of-change-label {
  margin-right: 10px;
  margin-top: 5px;
  width: 153px
}

.records-of-work-on-order-autocomplete-month {
  width: 250px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-order-autocomplete-year {
  width: 125px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-order-autocomplete-organizations {
  width: 400px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-order-autocomplete-separation-scheme {
  width: 268px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-order-indentation-for-inputs {
  margin-right: 10px;
  width: 95px;
}

.records-of-work-on-order-amount-of-change-input {
  margin-top: 5px;
  margin-right: 10px;
  width: 90px;
}

.records-of-work-on-order-coefficient-input {
  margin-right: 10px;
  width: 88px;
}

.records-of-work-on-order-descr-of-production-input {
  margin-right: 10px;
  width: 410px;
}

.records-of-work-on-order-btn {
  padding-top: 10px;
  margin-right: 10px;
  margin-top: 5px
}

.records-of-work-on-order-tpid-input {
  margin-right: 10px;
  width: 100px;
}

.records-of-work-on-order-tpname-input {
  margin-right: 10px;
  width: 210px;
}

#records-of-work-on-order-org-operations {
  border-collapse: collapse;
  width: 100%;
  height: 400px;
}

#records-of-work-on-order-org-operations table {
  width: 100%;
}

#records-of-work-on-order-org-operations td, #records-of-work-on-order-org-operations th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-on-order-org-operations th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#records-of-work-on-order-operations {
  border-collapse: collapse;
  width: 100%;
  height: 200px;
}

#records-of-work-on-order-operations table {
  width: 100%;
}

#records-of-work-on-order-operations td, #records-of-work-on-order-operations th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-on-order-operations th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#records-of-work-on-order-dressmakers-and-operations {
  border-collapse: collapse;
  width: 100%;
  height: 620px;
}

#records-of-work-on-order-dressmakers-and-operations table {
  width: 100%;
}

#records-of-work-on-order-dressmakers-and-operations td, #records-of-work-on-order-dressmakers-and-operations th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-on-order-dressmakers-and-operations th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

#records-of-work-on-order-dressmakers {
  border-collapse: collapse;
  width: 100%;
  height: 572px;
}

#records-of-work-on-order-dressmakers table {
  width: 100%;
}

#records-of-work-on-order-dressmakers td, #records-of-work-on-order-dressmakers th {
  border: 1px solid #ddd;
  word-break: break-all !important;
  padding: 0 0 !important;
  height: 0 !important;
}

#records-of-work-on-order-dressmakers th {
  padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: #639db1 !important;
  color: white;
}

.records-of-work-on-order-left-arrow {
  padding-top: 250px;
  flex: 0 0 10%;
  max-width: 10%;
}

.records-of-work-on-order-dressmakers-div {
  flex: 0 0 90%;
  max-width: 90%;
}

.records-of-work-on-order-list-of-dressmakers-headers-spacer {
  flex: 0 0 10%;
  max-width: 10%;
}

.records-of-work-on-order-list-of-dressmakers-headers {
  flex: 0 0 90%;
  max-width: 90%;
}

.records-of-work-on-order-col-4 {
  flex: 0 0 33%;
  max-width: 33%;
  margin-top: 5px
}

.records-of-work-on-order-col-5 {
  flex: 0 0 42%;
  max-width: 42%;
  margin-top: 5px
}

.records-of-work-on-order-org-operations-table-col-4 {
  flex: 0 0 33%;
  max-width: 33%;
  margin-top: 5px;
  padding-right: 10px;
}

.records-of-work-on-order-dressmakers-and-operations-col-5 {
  flex: 0 0 42%;
  max-width: 42%;
  margin-top: 5px;
  padding-right: 10px;
}

.records-of-work-on-order-col-3 {
  flex: 0 0 25%;
  max-width: 25%;
  margin-top: 5px
}
</style>
