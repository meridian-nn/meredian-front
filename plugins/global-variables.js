/* eslint-disable */
import Vue from 'vue'
Vue.mixin({
    methods: {
        // Функция проверки закрытого периода
        checkClosedPeriod(date) {
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
            return new Date(this.convertLocaleDateStringinISODateString(date.toString())) < new Date(`${z}-${y}-01`)
        }
    }
})