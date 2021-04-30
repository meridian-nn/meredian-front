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
            <span class="headline">Оплата по кассе</span>
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
              <v-autocomplete
                v-model="editedItem.myorgId"
                label="Плательщик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="editedItem.sumDoc"
                type="number"
                label="Сумма"
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
            <v-col cols="4">
              <v-text-field
                v-model.number="spDocch.hozrasx"
                type="number"
                label="Хоз. расходы"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="spDocch.komand"
                type="number"
                label="Командировочные"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="spDocch.gsm"
                type="number"
                label="ГСМ"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model.number="spDocch.zarpl"
                type="number"
                label="Зарплата"
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
  name: 'PaymentByCashbox',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      date: new Date().toLocaleDateString(),
      dialog: false,
      loadingType: {},
      id: null,
      editedItem: {},
      spDocch: {},
      payers: [],
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
      this.findPayers()
      this.findGroups()
    },
    async findPayers() {
      if (!this.payers.length) {
        this.loadingType.payers = true
        this.payers = await this.$axios.$get('/meridian/oper/dict/spOrg/findPayers')
        this.loadingType.payers = null
      }
    },
    async findGroups() {
      if (!this.groups.length) {
        this.loadingType.groups = true
        this.groups = await this.$axios.$get('/meridian/oper/dict/spViddocopl/findGroup')
        this.loadingType.groups = null
      }
    },
    async findEditedItem(accId) {
      if (this.id) {
        this.editedItem = await this.$axios.$get('/meridian/oper/spDocopl/findById/' + this.id)
        this.editedItem.accId = accId
      }
    },
    async save() {
      let errorMessage = null
      this.editedItem.dataDoc = this.date
      this.spDocch.spDocopl = this.editedItem
      if (!this.spDocch.id) {
        this.spDocch.id = 0
      }

      await this.$axios.$post('/meridian/oper/spDocopl/savePayment', this.editedItem).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })

      if (errorMessage == null && this.editedItem.viddocId === 25) {
        await this.$axios.$post('/meridian/oper/spDocopl/saveSpDocch', this.spDocch).catch((error) => {
          errorMessage = error
          alert(errorMessage)
        })
      }

      if (errorMessage == null) {
        this.dialog = false
      }
      this.$emit('save')
    },
    cancel() {
      this.reset()
      this.dialog = false
      this.$emit('cancel')
    },
    reset() {
      this.loadingType = {}
      this.editedItem = {}
      this.spDocch = {}
      this.id = null
    },
    /* newDocument() {
      this.reset()
      this.dialog = true
    }, */
    editDocument(id, accId) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem(accId)
    }
  }
}
</script>
