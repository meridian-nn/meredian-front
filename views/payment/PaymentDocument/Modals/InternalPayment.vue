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
                v-model="editedItem.kontrId"
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
                v-model="editedItem.accId"
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

          <v-snackbar
            v-model="snackbarUserNotification"
            :timeout="snackbarUserNotificationTimeout"
            :color="snackbarUserNotificationColor"
          >
            {{ snackbarUserNotificationText }}

            <template #action="{ attrs }">
              <v-btn
                v-bind="attrs"
                text
                @click="snackbarUserNotification = false"
              >
                Закрыть
              </v-btn>
            </template>
          </v-snackbar>
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
export default {
  name: 'InternalPayment',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: new Date().toLocaleDateString(),
      selectedOrganizationId: null,
      selectedOrganization: {},
      dialog: false,
      loadingType: {},
      id: null,
      editedItem: {},
      organizations: [],
      paymentAccounts: [],
      groups: [],

      // Информационное сообщение для пользователя
      snackbarUserNotification: false,
      snackbarUserNotificationTimeout: 3000,
      snackbarUserNotificationColor: '',
      snackbarUserNotificationText: ''
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

    async findOrganizations() {
      this.loadingType.organizations = true

      const data = {
        typeCode: 1
      }
      this.organizations = await this.$axios.$get('/meridian/oper/dict/spOrg/findByOrgTypeCode', { params: data })

      this.loadingType.organizations = null
    },

    async findGroups() {
      if (!this.groups.length) {
        this.loadingType.groups = true
        this.groups = await this.$axios.$get('/meridian/oper/dict/spViddocopl/findDepartments', this.axiosConfig)
        this.loadingType.groups = null
      }
    },

    organizationChange(val) {
      this.findPaymentAccounts(val)
    },

    // Функция поиска расчетных счетов выбранной организации
    async findPaymentAccounts(val) {
      this.loadingType.paymentAccounts = true

      let paymentAccounts = await this.$axios.$get('/meridian/oper/spAcc/findByOrgId?orgId=' + val)
      paymentAccounts = paymentAccounts.sort(this.compare('shortName'))
      paymentAccounts.forEach((account) => {
        account.shortName = account.shortName + ' - ' + account.numAcc.slice(account.numAcc.length - 4)
      })

      this.paymentAccounts = paymentAccounts

      this.loadingType.paymentAccounts = null
    },

    async findEditedItem() {
      if (this.id) {
        const editedItem = await this.$axios.$get('/meridian/oper/spDocopl/findById/' + this.id, this.axiosConfig)
        this.editedItem = editedItem
      }
    },

    async save() {
      if (!this.checkParamsOfEditedItem()) {
        return
      }

      let errorMessage = null
      await this.$axios.$post('/meridian/oper/spDocopl/save', this.editedItem, this.axiosConfig).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })
      if (errorMessage == null) {
        this.dialog = false
      }
      this.$emit('save')
    },

    checkParamsOfEditedItem() {
      let verificationPassed = true
      if (this.editedItem.kontrId === this.selectedOrganizationId) {
        this.showUserNotification('error', 'В полях "Плательщик" и "Кому" не может быть одна и та же организация!', 3000)
        verificationPassed = false
      }
      return verificationPassed
    },

    cancel() {
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },

    reset() {
      this.loadingType = {}
      this.editedItem = {}
      this.id = null
    },

    newDocument(selectedOrganization) {
      this.selectedOrganizationId = selectedOrganization
      this.findPayerById()
      this.reset()
      this.dialog = true
    },

    async findPayerById() {
      this.selectedOrganization = await this.$axios.$get('/meridian/oper/dict/spOrg/findById/' + this.selectedOrganizationId)
    },

    editDocument(id) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem()
    },

    // Отображение информационного сообщения пользователю
    showUserNotification(color, text, timeout) {
      if (!color ||
      !text ||
      !timeout) {
        return
      }
      this.snackbarUserNotification = true
      this.snackbarUserNotificationColor = color
      this.snackbarUserNotificationTimeout = timeout
      this.snackbarUserNotificationText = text
    },

    compare(field, order) {
      let len = arguments.length
      if (len === 0) {
        return (a, b) => (a < b && -1) || (a > b && 1) || 0
      }
      if (len === 1) {
        switch (typeof field) {
          case 'number':
            return field < 0
              ? (a, b) => (a < b && 1) || (a > b && -1) || 0
              : (a, b) => (a < b && -1) || (a > b && 1) || 0
          case 'string':
            return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
        }
      }
      if (len === 2 && typeof order === 'number') {
        return order < 0
          ? (a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0
          : (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
      }
      let fields, orders
      if (typeof field === 'object') {
        fields = Object.getOwnPropertyNames(field)
        orders = fields.map(key => field[key])
        len = fields.length
      } else {
        fields = new Array(len)
        orders = new Array(len)
        for (let i = len; i--;) {
          fields[i] = arguments[i]
          orders[i] = 1
        }
      }
      return (a, b) => {
        for (let i = 0; i < len; i++) {
          if (a[fields[i]] < b[fields[i]]) { return orders[i] }
          if (a[fields[i]] > b[fields[i]]) { return -orders[i] }
        }
        return 0
      }
    }
  }
}
</script>
