<template>
  <div class="v-table">
    <v-data-table
      :value="value"
      :height="height"
      :headers="Headers"
      fixed-header
      :show-select="true"
      :single-select="false"
      disable-pagination
      hide-default-footer
      @update:sort-by="updateSort('by', $event)"
      @update:sort-desc="updateSort('desc', $event)"
    >
      <template #body="{ items }">
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
            :value="item"
            @contextmenu="showFromPayMenu($event, item)"
            @click="fillCommentOfCurrentRow(item)"
          >
            <template v-for="td in item">
              <td :key="td">
                {{ item.dataDoc }}
              </td>
            </template>
          </tr>

          <infinite-loading
            :key="keyLoading"
            spinner="spiral"
            :identifier="identifier"
            @infinite="findSpDocoplForPay"
          >
            <div slot="no-more" />
            <div slot="no-results" />
          </infinite-loading>
        </tbody>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'VTable',

  props: {
    value: {
      required: true,
      validator: () => true
    },

    height: {
      type: String,
      default: '580'
    }
  },

  data() {
    return {
      sortBy: [],
      keyLoading: Math.random(),
      infiniteIdOfloadData: 0
    }
  },

  methods: {
    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }

      this.$emit('sort')
      this.keyLoading = Math.random()
    },

    identifier() {
      this.infiniteIdOfFromPayData += 1

      this.$emit('identifier', this.infiniteIdOfFromPayData)
    }
  }
}
</script>
