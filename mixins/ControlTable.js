export default ({
  name: 'ControlTable',

  data() {
    return {
      maxRow: 0,
      maxCell: 0,
      rowIndex: null,
      cellIndex: null
    }
  },

  mounted() {
    const table = this.$refs.table.$el.querySelector('table')

    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        table.querySelector('.select-td input').focus()
      }
    })

    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()

        if (this.maxCell > (this.cellIndex + 1)) {
          this.cellIndex += 1
        }
        this.unselect()
        this.select()
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault()
        if (this.rowIndex > 1) {
          this.rowIndex -= 1
        }
        this.unselect()
        this.select()
      }

      if (event.key === 'ArrowDown') {
        event.preventDefault()
        if (this.maxRow > this.rowIndex) {
          this.rowIndex += 1
        }
        this.unselect()
        this.select()
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        if (this.cellIndex > 1) {
          this.cellIndex -= 1
        }
        this.unselect()
        this.select()
      }
    })

    table.addEventListener('click', (event) => {
      this.unselect()

      if (event.target.tagName === 'TD') {
        this.updateCell(event)
        this.select()
      }
    })
  },

  methods: {
    updateCell(event) {
      this.rowIndex = event.target.closest('tr').rowIndex
      this.cellIndex = event.target.cellIndex
    },

    setMaxTable(maxRow) {
      this.maxRow = maxRow
      const tmp = this.$refs.table.$el.querySelector('table tbody').querySelector('tr')
      this.maxCell = tmp.querySelectorAll('td').length
    },

    unselect() {
      [].forEach.call(this.$refs.table.$el.querySelectorAll('td'), function(el) {
        el.classList.remove('select-td')
      })
    },

    select() {
      this.$refs.table.$el.querySelector('table').querySelectorAll('tr')[this.rowIndex].querySelectorAll('td')[this.cellIndex].classList.add('select-td')
    }
  }
})
