<template>
  <v-menu
    v-model="contextMenu"
    :position-x="xContextMenu"
    :position-y="yContextMenu"
    absolute
    offset-y
  >
    <v-list>
      <v-list-item @click="openModal('size')">
        <v-list-item-title>
          Просмотр заказа по размерам
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('tailoring')">
        <v-list-item-title>
          Отметка о выполнении пошива
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('cutting')">
        <v-list-item-title>
          Отметка о выполнении раскроя
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('actualConsumptionRawMaterials')">
        <v-list-item-title>
          Фактический расход сырья
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="data.length ?
          openModalConsolidatedOrder('new') :
          $emit('error', 'Сначала выберите записи для формирования сводного заказа')"
      >
        <v-list-item-title>
          Новый сводный заказ
        </v-list-item-title>
      </v-list-item>

      <v-list-item
        @click="data.length && currentRowOfTableForContextMenu.parent !== 0 ?
          openModalConsolidatedOrder('edit') :
          $emit('errorEditConsolidatedOrder')"
      >
        <v-list-item-title>
          Коррекция сводного заказа
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('logosOrder')">
        <v-list-item-title>
          Рисунки логотипов/вышивок
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('listResources')">
        <v-list-item-title>
          Обеспечение заказа сырьем
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('oldOrderCard')">
        <v-list-item-title>
          Карточка заказа старая
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('tailoringOrder')">
        <v-list-item-title>
          Заказ на пошив
        </v-list-item-title>
      </v-list-item>

      <v-list-item @click="openModal('notesOnNtd')">
        <v-list-item-title>
          Замечания по нтд
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
export default {
  name: 'SewingOrderLogContextMenu',

  props: {
    data: {
      type: Array,
      default: () => {}
    }
  },

  data() {
    return {
      contextMenu: false,
      currentRowOfTableForContextMenu: null,
      xContextMenu: 0,
      yContextMenu: 0
    }
  },

  methods: {
    rightClickHandler(event, item) {
      event.preventDefault()

      this.contextMenu = false
      this.currentRowOfTableForContextMenu = null
      this.xContextMenu = event.clientX
      this.yContextMenu = event.clientY
      this.$nextTick(() => {
        this.contextMenu = true
        this.currentRowOfTableForContextMenu = item
      })
    },
    openModalConsolidatedOrder(typeOperation) {
      this.$emit('typeOperation', typeOperation)
      this.openModal('consolidatedOrder')
    },

    openModal(name) {
      this.$emit('openModal', name)
    }
  }
}
</script>
