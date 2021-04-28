<template>
  <v-dialog
    v-model="dialog"
    :value="show"
    max-width="1000px"
    @input="$emit('close')"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Оплата по кассе</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="10">
              <div
                align="center"
                class="headline"
              >
                Оплата по кассе
              </div>
            </v-col>
            <v-col cols="2">
              <div
                align="center"
              >
                {{ date }}
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
              <v-autocomplete
                v-model="editedItem.myorgId"
                label="Плательшик"
                :loading="loadingType.payers"
                :items="payers"
                item-value="id"
                item-text="clName"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="5">
              <v-text-field
                v-model="editedItem.sumDoc"
                type="number"
                label="Сумма"
                @input="calcSum"
              />
            </v-col>
            <v-col cols="5">
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
                v-model="editedItem.prim"
                label="Хоз. расходы"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="editedItem.prim"
                label="Командировочные"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="editedItem.prim"
                label="ГСМ"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="editedItem.prim"
                label="Зарплата"
              />
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="10">
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
        this.payers = await this.$axios.$get('/meridian/oper/dict/spOrg/findPayers', this.axiosConfig)
        this.loadingType.payers = null
      }
    },
    async findGroups() {
      if (!this.groups.length) {
        this.loadingType.groups = true
        this.groups = await this.$axios.$get('/meridian/oper/dict/spViddocopl/findDepartments', this.axiosConfig)
        this.loadingType.groups = null
      }
    },
    async findEditedItem() {
      if (this.id) {
        const editedItem = await this.$axios.$get('/meridian/oper/spDocopl/findById/' + this.id, this.axiosConfig)
        this.spDocch = editedItem.spDocch || {}
      }
    },
    async save() {
      let errorMessage = null
      this.editedItem.dataDoc = this.date
      await this.$axios.$post('/meridian/oper/spDocopl/save', this.editedItem, this.axiosConfig).catch((error) => {
        errorMessage = error
        alert(errorMessage)
      })
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
    newDocument() {
      this.reset()
      this.dialog = true
    },
    editDocument(id) {
      this.reset()
      this.id = id
      this.dialog = true
      this.findEditedItem()
    }
  }
}
</script>
