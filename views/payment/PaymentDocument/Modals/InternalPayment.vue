<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <span class="headline">Внутренний платёж</span>
          </v-col>
          <v-col cols="2">
            <div
              align="center"
            >
              {{ date }}
            </div>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="selectedOrganization.shortName"
                readonly="true"
                label="Плательщик"
                hide-details="auto"
                outlined
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="spDocint.kontrId"
                label="Кому"
                :loading="loadingType.organizations"
                :items="organizations"
                item-value="id"
                item-text="clName"
                @change="organizationChange"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-autocomplete
                v-model="spDocint.accId"
                label="Р/счет"
                :loading="loadingType.paymentAccounts"
                :items="paymentAccounts"
                item-text="shortName"
                item-value="id"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model="editedItem.sumDoc"
                type="number"
                label="Сумма"
                @input="calcSum"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="editedItem.viddocId"
                label="Группа"
                :loading="loadingType.groups"
                :items="groups"
                item-value="id"
                item-text="nameViddoc"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="editedItem.prim"
                label="Примечание"
              />
            </v-col>
          </v-row>

          <user-notification ref="userNotification" />
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
  </v-dialog>
</template>

<script>
import UserNotification from '@/views/special_components/information_window/UserNotification'

export default {
  name: 'InternalPayment',
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
      date: new Date().toLocaleDateString(),

      // id организации, выбранной на форме "Журнал документов на оплату"
      selectedOrganizationId: null,

      // организация, выбранная на форме "Журнал документов на оплату"
      selectedOrganization: {},

      dialog: false,

      // объект для отображения загрузки данных для полей
      loadingType: {},

      // id документа на оплату
      id: null,

      // документ на оплату
      editedItem: {},

      // внутренний платеж
      spDocint: {},

      // список организаций для выбора пользователем
      organizations: [],

      // р/счета выбранной организации
      paymentAccounts: [],

      // список групп для выбора пользователем
      groups: []
    }
  },

  watch: {
    dialog(val) {
      if (val) {
        this.init()
      }
    }
  },

  methods: {
    init() {
      this.findOrganizations()
      this.findGroups()
    },

    // поиск организаций для выбора пользователем на форме
    async findOrganizations() {
      this.loadingType.organizations = true

      const data = {
        typeCode: 1
      }
      this.organizations = await this.$api.organizations.findByOrgTypeCode(data)
      // $axios.$get('/meridian/oper/dict/spOrg/findByOrgTypeCode', { params: data })

      this.loadingType.organizations = null
    },

    // поиск групп для выбора пользователем на форме
    async findGroups() {
      if (!this.groups.length) {
        this.loadingType.groups = true
        this.groups = await this.$api.budgetElements.findDepartments()
        // $axios.$get('/meridian/oper/dict/spViddocopl/findDepartments', this.axiosConfig)
        this.loadingType.groups = null
      }
    },

    // обработка события изменения организации пользователем на форме
    organizationChange(val) {
      delete (this.spDocint.accId)
      this.editedItem.contractorId = this.spDocint.kontrId
      this.findPaymentAccounts(val)
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId: val
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      // $axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val)
      paymentAccounts = paymentAccounts.sort(this.$compare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    /* newDocument(selectedOrganization) {
      this.reset()
      this.findPayerById()

      this.dialog = true
    }, */

    // открытие формы из журнала документов
    editDocument(id, selectedOrganization, accId) {
      this.reset()

      this.selectedOrganizationId = selectedOrganization
      this.findPayerById()

      this.id = id
      this.dialog = true
      this.findEditedItem(accId)
    },

    // поиск организации-плательщика по id
    async findPayerById() {
      this.selectedOrganization = await this.$api.organizations.findById(this.selectedOrganizationId)
      // $axios.$get('/meridian/oper/dict/spOrg/findById/' + this.selectedOrganizationId)
    },

    // поиск документа на оплату по id
    async findEditedItem(accId) {
      if (this.id) {
        const editedItem = await this.$api.payment.docOplForPay.findById(this.id)
        // $axios.$get('/meridian/oper/spDocopl/findById/' + this.id, this.axiosConfig)
        this.editedItem = editedItem
        this.editedItem.accId = accId
      }
    },

    // функция отработки события нажития на кнопку "отмена"
    cancel() {
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },

    // функция обнуления всех переменных формы
    reset() {
      this.loadingType = {}
      this.editedItem = {}
      this.id = null
    },

    // функция сохранения внутреннего платежа
    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      this.editedItem.spDocints.push(this.spDocint)
      let errorMessage = null
      // await this.$api.payment.saveInternalPayment(this.editedItem)
      await this.$axios.$post('/oper/spDocopl/saveInternalPayment', this.editedItem).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })
      if (errorMessage == null) {
        this.dialog = false
      }
      this.$emit('save')
    },

    // функция проверки заполнения обязательных полей
    checkParamsOfEditedItem() {
      let verificationPassed = true
      if (this.spDocint.kontrId === this.selectedOrganizationId) {
        this.$refs.userNotification.showUserNotification('error', 'В полях "Плательщик" и "Кому" не может быть одна и та же организация!')
        verificationPassed = false
      } else if (!this.spDocint.kontrId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите организацию, которой производится платёж!')
        verificationPassed = false
      } else if (!this.spDocint.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчетный счет организации!')
        verificationPassed = false
      } else if (!this.editedItem.sumDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите сумму оплаты!')
        verificationPassed = false
      } else if (!this.editedItem.viddocId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите группу!')
        verificationPassed = false
      }
      return verificationPassed
    }
  }
}
</script>
