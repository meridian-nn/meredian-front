<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1200px"
    padding="0px"
    persistent
    class="edit-payment-document-modal"
    @input="$emit('close')"
  >
    <v-card class="modal-card">
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
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.payer"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="PayersAndForWhoms"
                item-value="client_id"
                item-text="cl_name"
                hide-details="auto"
                return-object
                outlined
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.recipient"
                label="Получатель"
                :loading="loadingType.recipients"
                :items="recipients"
                item-value="id"
                item-text="clName"
                hide-details="auto"
                return-object
                outlined
                @input="createPoluchName"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.forWhom"
                label="За кого"
                :loading="loadingType.forWhoms"
                :items="PayersAndForWhoms"
                item-value="client_id"
                item-text="cl_name"
                hide-details="auto"
                return-object
                outlined
                @change="createFioZisp"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="selectedExecutor"
                label="Исполнитель"
                :loading="loadingType.executors"
                :items="executors"
                item-value="id"
                item-text="fio"
                hide-details="auto"
                outlined
                @change="loadDataExecutor"
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
                @change="selectingBudgetFields"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="createdItem.collaborator"
                label="Соисполнитель"
                :loading="loadingType.collaborators"
                :items="collaborators"
                item-value="fio"
                item-text="fio"
                hide-details="auto"
                return-object
                outlined
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

            <v-col cols="5">
              <v-row>
                <v-col
                  cols="6"
                  class="pb-0"
                >
                  <v-checkbox
                    v-model="createdItem.fsn"
                    label="На собственные нужды"
                    :true-value="1"
                    :false-value="0"
                  />
                </v-col>
                <v-col
                  cols="6"
                  class="pb-0"
                >
                  <v-checkbox
                    v-model="createdItem.vidFind"
                    label="Внутренний документ"
                    :true-value="1"
                    :false-value="0"
                  />
                </v-col>
                <v-col
                  cols="6"
                  class="pt-0"
                >
                  <v-checkbox
                    v-model="createdItem.fosn"
                    label="Основное средство"
                    class="mt-0"
                    :true-value="1"
                    :false-value="0"
                  />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-col col="12">
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="text-h6">Заказчик покупки</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="createdItem.dispId"
                          label="Исполнитель"
                          :loading="loadingType.executors"
                          :items="executors"
                          item-value="id"
                          item-text="fio"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="createdItem.dsoispId"
                          label="Соисполнитель"
                          :loading="loadingType.collaborators"
                          :items="collaborators"
                          item-value="id"
                          item-text="fio"
                          hide-details="auto"
                          outlined
                        />
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-col>
          </v-row>
          <v-row>
            <v-col col="12">
              <v-expansion-panels v-model="panel">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    <span class="text-h6">Для бюджета</span>
                  </v-expansion-panel-header>

                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="createdItem.otdId"
                          label="Отдел"
                          :loading="loadingType.departments"
                          :items="departments"
                          item-value="client_id"
                          item-text="cl_name"
                          hide-details="auto"
                          :disabled="disabledBudgetFields ? true : false"
                          outlined
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-autocomplete
                          v-model="createdItem.statiId"
                          label="Статья"
                          :loading="loadingType.articles"
                          :items="articles"
                          item-value="stati_id"
                          item-text="snumname"
                          hide-details="auto"
                          :disabled="disabledBudgetFields ? true : false"
                          outlined
                        />
                      </v-col>
                    </v-row>
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
                          v-model="createdItem.budCfo"
                          label="ЦФО"
                          :loading="loadingType.cfo"
                          :items="cfo "
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
  name: 'CreateOutgoingPaymentDocument',
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
      panel: [1],
      // переменная, отвечающая за отображениие модального окна
      dialog: false,
      // объект для отображения загрузки данных для полей
      loadingType: {},
      // объект, в котором хранится создаваемый документ
      createdItem: {
        isp_id: 0,
        vid_find: 0
      },
      // массив плательщиков и За кого
      PayersAndForWhoms: [],
      // массив получателей
      recipients: [],
      // массив Исполнителей
      executors: [],
      // массив соисполнителей
      collaborators: [],
      // массив исполнителей из подраздела "Заказчик покупки"
      customerRecipients: [],
      // массив соисполнителей из подраздела "Заказчик покупки"
      customerCollaborators: [],
      // массив отделов
      departments: [],
      // массив статей
      articles: [],
      // массив элементов бюджета
      elements: [],
      // массив ЦФО
      cfo: [],
      // переменная для автоподставления Исполнителя
      selectedExecutor: null,
      // переменная для автоподставления Кода элемента
      elementCode: null,
      // объект с выбранным элементом
      element: [{
        id: null,
        codElem: null
      }],
      disabledBudgetFields: false,
      header: ''
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.findPayersAndForWhoms()
      this.findRecipients()
      this.findExecutors()
      this.findBudgetsDepartments()
      this.findBudgetsArticles()
      this.findBudgetsCFO()
      this.findColoborators()
      this.findBudElemends()
    },
    // функция открытия формы для создания или редактирования нового документа
    newOrEditDocument(dataForEdit) {
      if (dataForEdit) {
        this.header = 'Редактирование исходящего платежного документа'
        this.createdItem = { ...dataForEdit }
        this.createdItem.dataVipis = this.convertLocaleDateStringinISODateString(dataForEdit.dataVipis.toString())
        if (dataForEdit.dataOpl) { this.createdItem.dataOpl = this.convertLocaleDateStringinISODateString(dataForEdit.dataOpl.toString()) }
        this.createdItem.payer = { 'client_id': dataForEdit.orgId }
        this.createdItem.recipient = { 'id': dataForEdit.poluchId }
        this.createdItem.forWhom = { 'client_id': dataForEdit.zaorgId }
        this.selectedExecutor = dataForEdit.zaorgIsp // zaorgIsp нету
        this.createdItem.collaborator = { 'fio': dataForEdit.fioSoisp, 'id': dataForEdit.soispId }
        this.element[0] = { id: dataForEdit.budElem, codElem: dataForEdit.budCodElem }
        this.selectElementCode()
        this.createdItem.objId = dataForEdit.findId
        this.createdItem.dataCreate = dataForEdit.dataCreate
        this.createdItem.descrCreate = dataForEdit.descrCreate
      } else {
        this.header = 'Ввод нового исходящего платежного документа'
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
      if (this.checkClosedPeriodAll(this.createdItem.dataVipis)) {
        this.$refs.userNotification.showUserNotification('error', 'Нельзя редактировать в закрытом периоде!!!')
        return
      }
      if (this.checkClosedPeriod(this.createdItem.dataVipis)) {
        this.$refs.userNotification.showUserNotification('error', 'Период закрыт!!!')
        return
      }
      let errorMessage = null
      const preparedData = { ...this.element[0], ...this.createdItem }
      const paramsForSave = this.createParamsForSaveNewOutgoingDocuments(preparedData)
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
        const text = this.header === 'Ввод нового исходящего платежного документа' ? 'При добавлении нового исходящего платежного документа возникла ошибка' : 'При сохранении отредактированного исходящего документа с id ' + this.createdItem.objId + ', произошла ошибка'
        this.$refs.userNotification.showUserNotification('error', text)
      }
    },
    // создание id
    async generateNewId() {
      const paramsForGenerateId = this.createStructureForGenerateIdforNewPaymentDocuments()
      const newId = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForGenerateId)
      this.createdItem.objId = newId[0].FINDZ_id1
    },
    // получение списка Плательщиков и За кого для выбора пользователем
    async findPayersAndForWhoms() {
      this.loadingType.payers = true
      this.loadingType.forWhoms = true
      const params = this.createStructureForPayersInOutgoingPaymentDocumentsInitDataProcedure()
      this.PayersAndForWhoms = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.loadingType.payers = null
      this.loadingType.forWhoms = null
    },

    // получение списка получателей для выбора пользователем
    async findRecipients() {
      this.loadingType.recipients = true
      this.recipients = await this.$api.organizations.findAll()
      this.loadingType.recipients = null
    },

    // получение Исполнителей
    async findExecutors() {
      this.loadingType.executors = true
      const params = this.creatCriteriasForGetExecutorsInCreatingNewDocument()
      this.executors = await this.$api.executors.findBySearchCriteria(params)
      this.loadingType.executors = null
    },
    async loadDataExecutor() {
      const params = this.createStructureForExecutorsPaymentDocumentsInitDataProcedure({ ispId: this.selectedExecutor })
      const exec = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.createdItem.zaorg_isp = exec[0].isp_id
      this.createdItem.fio_zisp = exec[0].fio
      this.selectedExecutor = exec[0].isp_id
    },
    // автовыбор исполнителя по полю За кого
    async createFioZisp() {
      const paramsForFioZisp = this.createStructureForExecutorsPaymentDocumentsInitDataProcedure({ ispId: this.createdItem.forWhom.glbuch_id })
      const response = await this.$api.service.executeStashedFunctionWithReturnedDataSet(paramsForFioZisp)
      this.createdItem.zaorg_isp = response[0].isp_id
      this.createdItem.fio_zisp = response[0].fio
      this.selectedExecutor = response[0].isp_id
    },
    // получение подразделений бюджета
    async findBudgetsDepartments() {
      this.loadingType.departments = true
      const params = this.createStructureForBudgetsDepartmentsInitDataProcedure()
      this.departments = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.loadingType.departments = null
    },
    // получение статей бюджета
    async findBudgetsArticles() {
      this.loadingType.articles = true
      const params = this.createStructureForBudgetsArticlesInitDataProcedure()
      this.articles = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)
      this.loadingType.articles = null
    },
    // получение ЦФО бюджета
    async findBudgetsCFO() {
      this.loadingType.cfo = true
      this.cfo = await this.$api.departments.findAll()
      this.loadingType.cfo = null
    },
    // получение Соисполнителей бюджета
    async findColoborators() {
      this.loadingType.collaborators = true
      this.collaborators = await this.$api.payment.outgoingPayment.findAllColoborators()
      this.loadingType.collaborators = null
    },
    // получение списка организаций для создания poluchName !!!
    async createPoluchName() {
      const criteriasForPoluchName = this.creatCriteriasForGetOrgInCreatingNewOutgoingDocument(this.createdItem.recipient.id)
      const org = await this.$api.organizations.findBySearchCriteria(criteriasForPoluchName)

      this.createdItem.poluchId = org[0].id
      this.createdItem.poluchName = org[0].clName + ',' + org[0].town
      if (this.createdItem.recipient.id === 10336 || org[0].korp === 1) {
        this.createdItem.vid_find = 1
      } else {
        this.createdItem.vid_find = 0
      }
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
    // автозаполнение полей в разделе Бюджет при выборе Исполнителей
    async selectingBudgetFields() {
      const params = this.createStructureForExecutorsPaymentDocumentsInitDataProcedure({ ispId: this.createdItem.ispId })
      const results = await this.$api.service.executeStashedFunctionWithReturnedDataSet(params)

      this.createdItem.ispId = results[0].isp_id
      this.createdItem.fio = results[0].fio

      if (results[0].otd_id === 21) {
        this.$set(this.createdItem, 'otd_id', 67)
        this.$set(this.createdItem, 'stati_id', 1)
        this.element = this.elements.filter(it => it.id === 21)
        this.$set(this.createdItem, 'bud_cfo', 846)
        this.disabledBudgetFields = true
        this.selectElementCode()
      } else if (results[0].otd_id === 29) {
        this.$set(this.createdItem, 'otd_id', 64)
        this.$set(this.createdItem, 'stati_id', 73)
        this.element = this.elements.filter(it => it.id === 114)
        this.$set(this.createdItem, 'bud_cfo', 846)
        this.disabledBudgetFields = true
        this.selectElementCode()
      } else if (results[0].otd_id === 123 || results[0].otd_id === 296) {
        this.$set(this.createdItem, 'otd_id', 64)
        this.$set(this.createdItem, 'stati_id', 72)
        this.element = this.elements.filter(it => it.id === 26)
        this.$set(this.createdItem, 'bud_cfo', 846)
        this.disabledBudgetFields = true
        this.selectElementCode()
      } else {
        this.$set(this.createdItem, 'otd_id', 0)
        this.$set(this.createdItem, 'stati_id', 0)
        this.element[0] = [{ id: null, codElem: null }]
        this.$set(this.createdItem, 'bud_cfo', 0)
        this.disabledBudgetFields = false
        this.selectElementCode()
      }
      if (results[0].tipotd_id === 2 || results[0].ptotd_id === 5) {
        this.element = this.elements.filter(it => it.id === 115)
        this.$set(this.createdItem, 'bud_cfo', 846)
      }
    },
    // сброс данных формы
    reset() {
      this.createdItem = { isp_id: 0 }
      this.element = [{ id: null, codElem: null }]
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
    -moz-appearance:textfield;
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

  .inputNumVipis input[type='number'] {
    -moz-appearance:textfield;
  }
  .inputNumVipis input::-webkit-outer-spin-button,
  .inputNumVipis input::-webkit-inner-spin-button {
      -webkit-appearance: none;
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
