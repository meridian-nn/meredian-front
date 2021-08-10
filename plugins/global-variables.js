/* eslint-disable */
import Vue from 'vue'
Vue.mixin({
    methods: {
        // Получение даты закрытого периода
        getDateClosedPeriod() {
            let x = new Date().getMonth()
            let y, z
            if (x > 3) {
                y = x -3
                z = new Date().getFullYear()
            }
            else {
                z = new Date().getFullYear() - 1
                if (x === 1) y = 10
                if (x === 2) y = 11
                if (x === 3) y = 12
            }
            return new Date(`${z}-${y}-01`)
        },
        // Функция проверки закрытого периода All
        checkClosedPeriodAll(date) {
            if (date[2] === '.') {
                console.log('ТЕСТ1')
                return new Date(this.convertLocaleDateStringinISODateString(date.toString())) < this.getDateClosedPeriod()
            }
            console.log('ТЕСТ2')
            return new Date(date.toString()) < this.getDateClosedPeriod()
        },   
        // Функция проверки закрытого периода
        checkClosedPeriod(date) {
            let dateClose = this.getDateClosedPeriod() - 31622400000
            return new Date(date.toString()) <= dateClose
        }
    }
})