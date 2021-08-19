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
        <div class="records-of-work-on-order-row">
          Запись работы по заказу

          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-btn
                style="margin-left: 7px"
                color="blue"
                fab
                dark
                x-small
                v-bind="attrs"
                v-on="on"
                @click="updateRecordsOfWorkOnOrder()"
              >
                <v-icon>
                  mdi-reload
                </v-icon>
              </v-btn>
            </template>
            <span>Обновить данные</span>
          </v-tooltip>
        </div>
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

            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <div
                  class="records-of-work-on-order-coefficient-input"
                  v-bind="attrs"
                  v-on="on"
                >
                  <div class="records-of-work-on-order-coefficient-brise-input">
                    <vue-numeric
                      v-model.number="coefficient"
                      separator="space"
                      :precision="2"
                      decimal-separator="."
                      output-type="number"
                      @change="coefficientChange"
                    />
                    <span class="line" />
                  </div>
                </div>
              </template>
              <span>Изменить во всех операциях у выбранной швеи</span>
            </v-tooltip>
          </div>

          <div class="records-of-work-on-order-btn-row">
            <div class="records-of-work-on-order-btn">
              <v-btn
                @click="createCards"
              >
                Сформировать карточки
              </v-btn>
            </div>

            <div class="records-of-work-on-order-btn">
              <v-btn
                @click="deleteCards"
              >
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
                v-model.number="chosenRecord.mcId"
                readonly
                hide-details="auto"
                outlined
              />
            </div>

            <div class="records-of-work-on-order-descr-of-production-input">
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model.number="chosenRecord.nameMc"
                    readonly
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>{{ chosenRecord.nameMc }}</span>
              </v-tooltip>
            </div>
          </div>

          <div class="records-of-work-on-order-row">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-simple-checkbox
                  v-model="example"
                  v-bind="attrs"
                  @change="exampleChange"
                  v-on="on"
                />

                <v-subheader
                  v-bind="attrs"
                  class="font-weight-medium text-subtitle-1"
                  style="margin-top: 10px"
                  v-on="on"
                >
                  Образец
                </v-subheader>
              </template>
              <span>Изменить во всех операциях у выбранной швеи</span>
            </v-tooltip>

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

            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <div
                  class="records-of-work-on-order-amount-of-change-input"
                  v-bind="attrs"
                  v-on="on"
                >
                  <v-text-field
                    v-model.number="amountOfChange"
                    hide-details="auto"
                    outlined
                  />
                </div>
              </template>
              <span>Изменить во всех операциях у выбранной швеи</span>
            </v-tooltip>
          </div>

          <div class="records-of-work-on-order-row">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn
                  style="margin-left: 7px"
                  color="blue"
                  fab
                  dark
                  x-small
                  v-bind="attrs"
                  v-on="on"
                  @click="deleteFio()"
                >
                  <v-icon>
                    mdi-close-octagon
                  </v-icon>
                </v-btn>
              </template>
              <span>Удалить ФИО</span>
            </v-tooltip>
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
              <v-tooltip bottom>
                <template #activator="{ on, attrs }">
                  <v-text-field
                    v-model.number="chosenRecord.modelName"
                    readonly
                    hide-details="auto"
                    outlined
                    v-bind="attrs"
                    v-on="on"
                  />
                </template>
                <span>{{ chosenRecord.modelName }}</span>
              </v-tooltip>
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
              v-model="selectedOrgOperations"
              height="400"
              :headers="orgOperationsHeaders"
              fixed-header
              :items="orgOperationsData"
              :show-select="false"
              :single-select="true"
              disable-pagination
              hide-default-footer
              no-data-text=""
              class="elevation-1"
              @click:row="selectOrgOperationEvent"
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
            show-select
            :single-select="true"
            disable-pagination
            hide-default-footer
            no-data-text=""
            class="elevation-1"
          />
        </div>

        <div class="records-of-work-on-order-col-3">
          <div class="records-of-work-on-order-row">
            <div class="records-of-work-on-order-list-of-dressmakers-headers-spacer" />
            <div class="records-of-work-on-order-list-of-dressmakers-headers">
              <div class="records-of-work-on-order-row">
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
                show-select
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

      TPid: null,

      TPname: '',

      separationScheme: [],

      chosenSeparationScheme: {},

      codeOfProduction: null,

      descrOfProduction: null,

      example: false,

      coefficient: 0,

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

      selectedOrgOperations: [],

      orgOperationsData: [],

      operationsSumsHeaders: [
        {
          text: 'Операция',
          value: 'codOp'
        },
        {
          text: 'Кол-во',
          value: 'colvoOp'
        },
        {
          text: 'Всего',
          value: 'colvoOpMes'
        },
        {
          text: 'Остаток',
          value: 'colvoOst'
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

    async updateRecordsOfWorkOnOrder(dontShowNotification) {
      await this.initSeparationScheme()
      await this.updateSeparationScheme()
      await this.selectSeparationSchemeOfChosenRecord()

      if (this.orgOperationsData.length > 0) {
        await this.selectOrgOperationEvent(this.orgOperationsData[0])
      }

      await this.initDataForListOfDressmakersData()
      await this.getListOfDressmakersDataTable()

      if (dontShowNotification) {
        return
      }

      this.$refs.userNotification.showUserNotification('success', 'Данные обновлены!')
    },

    async initCoefficientAndExample() {
      // TODO реализовать метод по выбору данных из таблицы "zar_tmk_op", как только будет реализована задача MERIDIAN-67
    },

    async coefficientChange() {
      this.varsOfForm.priznak1 = 6
      this.varsOfForm.coefficient = this.coefficient
      this.varsOfForm.obraz = this.example === true ? 1 : 0
      const params = this.createStructureForTechTmkUpdData(this.chosenRecord, this.varsOfForm)

      let response
      try {
        response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      } catch (error) {
        console.log(error)
        console.log(response)
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка в бд при изменении коэффициента!')
        return
      }

      await this.updateRecordsOfWorkOnOrder()
      this.$refs.userNotification.showUserNotification('success', 'Коэффициент изменен!')
    },

    async exampleChange() {
      this.varsOfForm.priznak1 = 5
      this.varsOfForm.coefficient = this.coefficient
      this.varsOfForm.obraz = this.example === true ? 1 : 0
      const params = this.createStructureForTechTmkUpdData(this.chosenRecord, this.varsOfForm)

      let response
      try {
        response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      } catch (error) {
        console.log(error)
        console.log(response)
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка в бд при изменении образца!')
        return
      }

      await this.updateRecordsOfWorkOnOrder()
      this.$refs.userNotification.showUserNotification('success', 'Образец изменен!')
    },

    async createCards() {
      this.varsOfForm.priznak1 = 7
      const params = this.createStructureForTechTmkUpdData(this.chosenRecord, this.varsOfForm)
      let response
      try {
        response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      } catch (error) {
        console.log(error)
        console.log(response)
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка в бд при формировании карточек!')
        return
      }

      await this.updateRecordsOfWorkOnOrder()
      this.$refs.userNotification.showUserNotification('success', 'Карточки сформированы!')
    },

    async deleteCards() {
      this.varsOfForm.priznak1 = 8
      this.varsOfForm.coefficient = this.coefficient
      this.varsOfForm.obraz = this.example === true ? 1 : 0
      const params = this.createStructureForTechTmkUpdData(this.chosenRecord, this.varsOfForm, this.selectedOrgOperations[0])

      let response
      try {
        response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      } catch (error) {
        console.log(error)
        console.log(response)
        this.$refs.userNotification.showUserNotification('error', 'Произошла ошибка в бд при удалении карточек!')
        return
      }

      await this.updateRecordsOfWorkOnOrder()
      this.$refs.userNotification.showUserNotification('warning', 'Карточки удалены!')
    },

    deleteFio() {
      this.$refs.userNotification.showUserNotification('warning', 'Функционал в разработке!')
    },

    async openWithObject(order, varsOfForm, chosenRecord) {
      if (!order) {
        return
      }

      const currDate = new Date()
      this.dateOfOperation = new Date(currDate.getFullYear(), currDate.getMonth(), currDate.getDay() - 1).toISOString().substr(0, 10)
      this.chosenRecord = chosenRecord
      this.orderFromRecordsOfWorkByCards = order
      this.varsOfForm = varsOfForm
      this.chosenMonth = this.varsOfForm.mesAnfb
      this.chosenYear = this.varsOfForm.godAnfb
      this.chosenOrg = this.varsOfForm.orgName
      this.dialog = true

      await this.updateRecordsOfWorkOnOrder(true)
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

    async initOperationsSumsData(item) {
      const paramsForRequest = {
        ...this.chosenRecord,
        ...item,
        ...this.varsOfForm,
        ...this.orderFromRecordsOfWorkByCards,
        ...this.selectedSeparationSchemeObj,
        ...{ priznak: 3, yearCurr: this.varsOfForm.godAnfb, monthCurr: this.varsOfForm.mesAnfb, proizvId: this.varsOfForm.proizvAnfb }
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

    async selectSeparationSchemeOfChosenRecord() {
      if (!this.separationScheme) {
        return
      }

      const chosenSeparationSchemeObj = this.separationScheme.find(separationScheme => separationScheme.schemeId === this.chosenRecord.schemeId)
      this.chosenSeparationScheme = chosenSeparationSchemeObj.id
      await this.separationSchemeChange()
    },

    async separationSchemeChange() {
      this.selectedSeparationSchemeObj = this.separationScheme.find(separationScheme => separationScheme.id === this.chosenSeparationScheme)
      await this.initOrgOperationData(this.selectedSeparationSchemeObj)
      await this.updateOrgOperationsData()
      this.operationsSumsData = []
      this.dressmakersData = []
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

    async selectOrgOperationEvent(selectedRow) {
      this.selectedOrgOperations = [selectedRow]
      await this.getDressMakersDataTable(selectedRow)
      await this.initOperationsSumsData(selectedRow)
      await this.updateOperationsSumsData()
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
  width: 379px;
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

.records-of-work-on-order-coefficient-brise-input {
  position: relative;
  margin: 5px;
  overflow: hidden;
}

.records-of-work-on-order-coefficient-brise-input input {
  width: 100%;
  padding: 10px;
  border: none;
  outline: none;
  border-bottom: 1px solid #999;
  box-sizing: border-box;
  font-size: 16px;
  position: relative;
  z-index: 5;
  background: none;
}

.records-of-work-on-order-coefficient-brise-input label {
  position: absolute;
  left: 10px;
  top: 45%;
  transition: ease-out .15s;
  color: #999;
}

.records-of-work-on-order-coefficient-brise-input input:valid ~ label, input:focus ~ label  {
  top: 0;
  transform: scale(0.94) translateX(-2px);
  color: #639db1;
}

.records-of-work-on-order-coefficient-brise-input .line {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #639db1;
  transition: .25s;
  opacity: 0;
  z-index: 6;
}

.records-of-work-on-order-coefficient-brise-input input:focus ~ .line {
  left: 0;
  opacity: 1;
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
  width: 325px;
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
  flex: 0 0 40%;
  max-width: 40%;
  margin-top: 5px
}

.records-of-work-on-order-org-operations-table-col-4 {
  flex: 0 0 33%;
  max-width: 33%;
  margin-top: 5px;
  padding-right: 10px;
}

.records-of-work-on-order-dressmakers-and-operations-col-5 {
  flex: 0 0 40%;
  max-width: 40%;
  margin-top: 5px;
  padding-right: 10px;
}

.records-of-work-on-order-col-3 {
  flex: 0 0 27%;
  max-width: 27%;
  margin-top: 5px
}
</style>
