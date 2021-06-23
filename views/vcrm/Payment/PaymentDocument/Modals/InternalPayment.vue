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
                :readonly="true"
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
                v-model.number="docFromPay.sumDoc"
                type="number"
                label="Сумма"
              />
            </v-col>
            <v-col cols="6">
              <v-autocomplete
                v-model="docFromPay.viddocId"
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
                v-model="docFromPay.prim"
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
import UserNotification from '@/components/information_window/UserNotification'

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

      // внутренний платеж
      spDocint: {
        kontrId: null,
        accId: null
      },

      // список организаций для выбора пользователем
      organizations: [],

      // р/счета выбранной организации
      paymentAccounts: [],

      // список групп для выбора пользователем
      groups: [],

      docFromPay: {},
      selectedAccOfOrg: null
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

      this.loadingType.organizations = null
    },

    // поиск групп для выбора пользователем на форме
    async findGroups() {
      if (this.groups.length) {
        return
      }
      this.loadingType.groups = true
      this.groups = await this.$api.budgetElements.findAllDocumentsTypes()
      this.loadingType.groups = null
    },

    // обработка события изменения организации пользователем на форме
    organizationChange() {
      this.spDocint.accId = null
      this.docFromPay.contractorId = this.spDocint.kontrId
      this.findPaymentAccounts(this.spDocint.kontrId)
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(orgId) {
      this.loadingType.paymentAccounts = true

      const data = {
        orgId
      }
      let paymentAccounts = await this.$api.paymentAccounts.findAccByOrgId(data)
      paymentAccounts = paymentAccounts.sort(this.customCompare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    newDocument(selectedOrganization, accId) {
      this.reset()
      this.selectedOrganizationId = selectedOrganization
      this.selectedAccOfOrg = accId
      this.findPayerById()
      this.createNewDocFromPay()
      this.dialog = true
    },

    createNewDocFromPay() {
      const currentDate = new Date()
      const dataDoc = currentDate.toISOString().substr(0, 10)
      currentDate.setDate(currentDate.getDate() + 3)
      const dataOplat = currentDate.toISOString().substr(0, 10)
      this.docFromPay = {
        accId: this.selectedAccOfOrg,
        creatorId: this.getCurrentUser().id,
        dataDoc: new Date(dataDoc).toLocaleDateString(),
        dataOplat: new Date(dataOplat).toLocaleDateString(),
        ispId: 0,
        myorgId: this.selectedOrganizationId,
        myOrg: {
          id: this.selectedOrganizationId
        },
        nameDoc: '-',
        paymentStatus: 'BANK',
        spDocches: [],
        spDocints: []
      }
    },

    // поиск организации-плательщика по id
    async findPayerById() {
      this.selectedOrganization = await this.$api.organizations.findById(this.selectedOrganizationId)
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
      this.docFromPay = {}
      this.spDocint = {
        kontrId: null,
        accId: null
      }
      this.selectedOrganization = {}
      this.selectedOrganizationId = null
      this.selectedAccOfOrg = null
      this.organizations = []
      this.paymentAccounts = []
      this.groups = []
      this.id = null
    },

    // функция сохранения внутреннего платежа
    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      this.docFromPay.descr = this.docFromPay.prim
      this.docFromPay.spDocints.push(this.spDocint)

      let errorMessage = null
      await this.$axios.$post('/oper/spDocopl/saveInternalPayment', this.docFromPay).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })
      if (errorMessage == null) {
        await this.changeVnplOfpaymentAccounts(this.docFromPay.accId, this.spDocint.accId, this.docFromPay.sumDoc)
        this.dialog = false
      }
      this.$emit('save')
    },

    // функция проверки заполнения обязательных полей
    checkParamsOfEditedItem() {
      let verificationPassed = true
      if (this.docFromPay.contractorId === this.selectedOrganizationId) {
        this.$refs.userNotification.showUserNotification('error', 'В полях "Плательщик" и "Кому" не может быть одна и та же организация!')
        verificationPassed = false
      } else if (this.docFromPay.accId === this.spDocint.accId) {
        this.$refs.userNotification.showUserNotification('error', 'В полях "Расчетный счет плательщика" и "Расчетный счет получателя" не может быть указан один и тот же счет!')
        verificationPassed = false
      } else if (!this.docFromPay.contractorId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите организацию, которой производится платёж!')
        verificationPassed = false
      } else if (!this.docFromPay.accId) {
        this.$refs.userNotification.showUserNotification('error', 'Выберите расчетный счет организации!')
        verificationPassed = false
      } else if (!this.docFromPay.sumDoc) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите сумму оплаты!')
        verificationPassed = false
      } else if (!this.docFromPay.viddocId) {
        this.$refs.userNotification.showUserNotification('error', 'Укажите группу!')
        verificationPassed = false
      }
      return verificationPassed
    }
  }
}
</script>
