/* eslint-disable */
import Vue from 'vue'
Vue.mixin({
    methods: {
        //Функция перевода числа в денежную сумму
        //На вход функция получает число, далее добавляет пробелы между разрядами и если нет знаков после запятой, добавляет два нуля 
        numberToSum(number) {
            const parts = (number + '').split('.')
            const main = parts[0]
            const len = main.length
            let output = ''
            let i = len - 1

            while (i >= 0) {
                output = main.charAt(i) + output
                if ((len - i) % 3 === 0 && i > 0) {
                    output = ' ' + output
                }
                --i
            }

            if (parts.length > 1) {
                const secPart = parts[1]
                    // eslint-disable-next-line vue/max-len
                const secNum = secPart.length === 1 ? secPart.toLocaleString() + 0 : secPart.charAt(0).toLocaleString() + secPart.charAt(1).toLocaleString()
                output += '.' + secNum
            } else {
                output += '.00'
            }

            return output
        }
    }
})