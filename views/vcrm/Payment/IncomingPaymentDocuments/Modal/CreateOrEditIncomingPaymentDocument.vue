<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    scrollable
    padding="0px"
    persistent
    class="edit-payment-document-modal"
    @input="$emit('close')"
  >
    <v-card
      class="modal-card"
    >
      <v-card-title>
        <v-container class="container-data">
          <v-row>
            <v-col cols="7">
              <span class="headline">{{ header }}</span>
            </v-col>
            <v-spacer />
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.numVipis"
                type="number"
                label="Выписка"
                class="inputNumVipis"
                outlined
              />
            </v-col>
          </v-row>
        </v-container>
      </v-card-title>

      <v-card-text>
        <v-container class="container-data">
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.numFind"
                label="Номер"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.dataVipis"
                type="date"
                label="Дата банковской выписки"
                outlined
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="createdItem.dataOpl"
                type="date"
                label="Дата оплаты"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="createdItem.payer"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                return-object
                outlined
                @input="getOrg"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="createdItem.recipient"
                label="Получатель"
                :loading="loadingType.recipients"
                :items="recipients"
                item-value="client_id"
                item-text="cl_name"
                hide-details="auto"
                return-object
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.ispId"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="fio"
                hide-details="auto"
                outlined
                @change="loadVIspf"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.soispId"
                label="Соисполнитель"
                :loading="loadingType.collaborators"
                :items="collaborators"
                item-value="id"
                item-text="fio"
                hide-details="auto"
                outlined
                @change="loadVSoispf"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="7">
              <v-row>
                <v-col
                  cols="4"
                  class="sum-header"
                >
                  Сумма по документу
                </v-col>
                <v-col cols="4">
                  <div class="sum-input">
                    <vue-numeric
                      v-model.number="createdItem.sumFind"
                      separator="space"
                      :precision="2"
                      decimal-separator="."
                      output-type="number"
                    />
                  </div>
                </v-col>
              </v-row>
            </v-col>

            <v-spacer />

            <v-col cols="3">
              <v-checkbox
                v-model="createdItem.vidFind"
                label="Внутренний документ"
                :true-value="1"
                :false-value="0"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col col="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="text-h6">Для бюджета</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="createdItem.comment"
                          label="Комментарий"
                          outlined
                        />
                      </v-col>
                      <v-subheader class="element-header">
                        Элемент:
                      </v-subheader>
                      <v-col cols="3">
                        <v-text-field
                          v-model="elementCode"
                          :disabled="disabledBudgetFields ? true : false"
                          outlined
                          readonly
                        />
                      </v-col>
                      <v-spacer />
                      <v-col cols="7">
                        <v-autocomplete
                          v-model="element[0]"
                          :loading="loadingType.elements"
                          :items="elements"
                          item-value="id"
                          item-text="nameElem"
                          hide-details="auto"
                          :disabled="disabledBudgetFields ? true : false"
                          outlined
                          return-object
                          @change="selectElementCode"
                        />
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="createdItem.namePodr"
                          label="ЦФО"
                          :loading="loadingType.cfo"
                          :items="cfo"
                          item-value="id"
                          item-text="namePodr"
                          hide-details="auto"
                          :disabled="disabledBudgetFields ? true : false"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="blue darken-1"
          text
          @click="cancel"
        >
          Отмена
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="save"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
    <user-notification ref="userNotification" />
  </v-dialog>
</template>

<script>
import UserNotification from '@/components/information_window/UserNotification'

export default {
  name: 'CreateIncomingPaymentDocument',
  components: {
    UserNotification
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // объект для отображения загрузки данных для полей
      loadingType: {},
      // переменная, отвечающая за отображениие модального окна
      dialog: false,
      // объект, в котором хранится создаваемый документ
      createdItem: {
        vid_find: 0
      },
      // массив плательщиков
      payers: [],
      // массив получателей
      recipients: [],
      // массив исполнителей
      executors: [],
      // массив соисполнителей
      collaborators: [],
      // массив элементов
      elements: [],
      // массив ЦФО
      cfo: [],
      disabledBudgetFields: false,
      elementCode: null,
      // объект с выбранным элементом
      element: [{
        id: null,
        codElem: null
      }],

      // Заголовок формы
      header: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findRecipients()
      this.findBudElemends()
      this.findBudgetsCFO()
      this.findPayers()
      this.findExecutors()
      this.findCollaborators()
    },
    // функция открытия формы для создания нового документа
    newOrEditDocument(dataForEdit) {
      if (dataForEdit) {
        this.header = 'Редактирование входящего платежного документа'
        this.createdItem = { ...dataForEdit }
        this.createdItem.dataVipis = this.convertLocaleDateStringinISODateString(dataForEdit.dataVipis.toString())
        if (dataForEdit.dataOpl) { this.createdItem.dataOpl = this.convertLocaleDateStringinISODateString(dataForEdit.dataOpl.toString()) }
        this.createdItem.recipient = { 'client_id': dataForEdit.poluchId, 'cl_name': dataForEdit.poluchName }
        this.createdItem.payer = { id: dataForEdit.orgId, clName: dataForEdit.platName }
        this.createdItem.ispId = dataForEdit.ispId
        this.createdItem.soispId = dataForEdit.soispId // soispId нет
        this.element[0] = { id: dataForEdit.budElem, codElem: dataForEdit.budCodElem }
        this.selectElementCode()
        this.createdItem.objId = dataForEdit.findId
        this.createdItem.dataCreate = dataForEdit.dataCreate
        this.createdItem.descrCreate = dataForEdit.descrCreate
      } else {
        this.header = 'Ввод нового входящего платежного документа'
        this.generateNewId()
      }
      this.dialog = true
    },
    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },

    async save() {
      let errorMessage = null
      const paramsForSave = this.createParamsForSaveNewIncomingDocuments(this.createdItem)
      await this.$api.payment.saveNewDocument(paramsForSave)
        .catch((error) => {
          errorMessage = error
          alert(errorMessage)
        })
      if (!errorMessage) {
        this.dialog = false
        this.reset()
        this.$emit('save')
      } else {
        const text = this.header === 'Ввод нового входящего платежного документа' ? 'При добавлении нового входящего платежного документа возникла ошибка' : 'При сохранении отредактированного входящего документа с id ' + this.createdItem.objId + ', произошла ошибка'
        this.$refs.userNotification.showUserNotification('error', text)
      }
    },

    // получение списка получателей для выбора пользователем
    async findRecipients() {
      this.loadingType.recipients = true
      const params = this.createStructureForPayersInIncomingPaymentDocumentsInitDataProcedure()
      this.recipients = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.loadingType.recipients = null
    },

    // получение списка элементов бюджета
    async findBudElemends() {
      this.loadingType.elements = true
      this.elements = await this.$api.payment.outgoingPayment.findAllBudElemends()
      this.loadingType.elements = null
    },
    // автовыбор Кода элемента
    selectElementCode() {
      this.createdItem.budElem = this.element[0].id
      this.elementCode = this.element[0].codElem
    },

    // получение ЦФО бюджета
    async findBudgetsCFO() {
      this.loadingType.cfo = true
      this.cfo = await this.$api.departments.findAll()
      this.loadingType.cfo = null
    },

    // получение списка Плательщиков для выбора пользователем (используется процедура исходящих ПД) !!!
    async findPayers() {
      this.loadingType.payers = true
      this.payers = await this.$api.organizations.findAll()
      this.loadingType.payers = null
    },
    async getOrg() {
      const criteriasForVidFind = this.creatCriteriasForGetOrgInCreatingNewIncomingDocument(this.createdItem.payer.id)
      const org = await this.$api.organizations.findBySearchCriteria(criteriasForVidFind)
      this.createdItem.clName = org[0].clName
      if (this.createdItem.payer.id === 10336 || org[0].korp === 1) {
        this.createdItem.vidFind = 1
      } else {
        this.createdItem.vidFind = 0
      }
    },

    // получение Исполнителей
    async findExecutors() {
      this.loadingType.executors = true
      const params = this.creatCriteriasForGetExecutorsInCreatingNewDocument()
      this.executors = await this.$api.executors.findBySearchCriteria(params)
      this.loadingType.executors = null
    },

    // получение списка Соисполнителей
    async findCollaborators() {
      this.loadingType.collaborators = true
      this.collaborators = await this.$api.payment.incomingPaymentDocuments.findAllColoborators()
      this.loadingType.collaborators = null
    },

    // загрузка данных при выборе Исполнителя
    async loadVIspf() {
      const paramsForGetVIspf = this.createStructureForExecutorsPaymentIncomingDocumentsInitDataProcedure({ ispId: this.createdItem.ispId })
      const vIspf = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForGetVIspf)
      this.createdItem.fioIsp = vIspf[0].fio
    },

    // загрузка данных при выборе Соисполнителя
    async loadVSoispf() {
      const criteriaForGetVSoispf = this.creatCriteriaForGetExecutorsInCreatingNewIncomingDocument(this.createdItem.soispId)
      const vSoispf = await this.$api.payment.incomingPaymentDocuments.findColoboratorBySearchCriteria(criteriaForGetVSoispf)
      this.createdItem.fioSoisp = vSoispf[0].fio
    },
    // сброс данных формы
    reset() {
      this.createdItem = { vidFind: 0 }
      this.element = [{ id: null, codElem: null }]
      this.elementCode = null
    },
    // создание find_id
    async generateNewId() {
      const paramsForGenerateId = this.createStructureForGenerateIdforNewPaymentDocuments()
      const newId = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForGenerateId)
      this.createdItem.objId = newId[0].FINDZ_id1
    }
  }
}
</script>

<style lang="scss">
.modal-card {
  max-width: 1200px;
}

.container-data {
  margin-left: 0;
  max-width: none;
}

.summ-to-pay input[type='number'] {
  -moz-appearance: textfield;
}

.summ-to-pay input::-webkit-outer-spin-button,
.summ-to-pay input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

.element-header {
  font-weight: bold;
  font-size: 18px;
  padding-top: 32px;
}
.sum-header {
  font-size: 17px;
  margin-top: 15px;
}
.sum-input input{
  font-size: 17px;
  margin-top: 16px;
  border-bottom: solid 1px #999;
  transition: all 0.1s;
  padding-bottom: 5px;
}
.sum-input input:focus-visible{
  font-size: 17px;
  margin-top: 16px;
  outline: none !important;
  border-bottom: 3px solid #639db1;
  transition: all 0.1s;
}
</style>
