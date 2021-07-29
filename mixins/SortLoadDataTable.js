export default ({
  data() {
    return {
      sortBy: [],
      sortDesc: [],
      infiniteIdData: 0,
      keyLoading: Math.random(),
      pageData: 0
    }
  },

  computed: {
    handleSortData() {
      const { sortDesc } = this

      return this.sortBy.map((item, i) => {
        return { 'direction': sortDesc[i] ? 'ASC' : 'DESC', 'property': item }
      })
    }
  },

  methods: {
    updateSort(byDesc, event) {
      if (byDesc === 'by') {
        this.sortBy = event
      } else if (byDesc === 'desc') {
        this.sortDesc = event
      }
      this.pageData = 0
      // Очистить данные
      this.keyLoading = Math.random()
    },

    infiniteHandler($state, api) {
      api.then(({ data }) => {
        if (data.hits.length) {
          this.page += 1
          this.list.push(...data.hits)
          $state.loaded()
        } else {
          $state.complete()
        }
      })
    }
  }
})
