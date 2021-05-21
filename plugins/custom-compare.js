/* eslint-disable */
import Vue from 'vue'
Vue.mixin({
    methods: {
        // Функция для сортировки массивов по переданному полю
        /* Примеры использования
        arr.sort(compare()); - Обычная типобезопасная сортировка по возрастанию
        arr.sort(compare(-1)); - Обычная типобезопасная сортировка по убыванию
        arr.sort(compare('field')); - Сортировка по свойству field по возрастанию
        arr.sort(compare('field', -1)); - Сортировка по свойству field по убыванию

        Сортировка сначала по полю field1
        при совпадении по полю field2, а если и оно совпало, то по полю field3
        все по возрастанию
        arr.sort(compare('field1', 'field2', 'field3'));

        Сортировка сначала по полю field1 по возрастанию
        при совпадении по полю field2 по убыванию
        arr.sort(compare({
            field1 : 1,
            field2 : -1
        })); */
        customCompare(field, order) {
            let len = arguments.length
            if (len === 0) {
                return (a, b) => (a < b && -1) || (a > b && 1) || 0
            }
            if (len === 1) {
                switch (typeof field) {
                    case 'number':
                        return field < 0 ?
                            (a, b) => (a < b && 1) || (a > b && -1) || 0 :
                            (a, b) => (a < b && -1) || (a > b && 1) || 0
                    case 'string':
                        return (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
                }
            }
            if (len === 2 && typeof order === 'number') {
                return order < 0 ?
                    (a, b) => (a[field] < b[field] && 1) || (a[field] > b[field] && -1) || 0 :
                    (a, b) => (a[field] < b[field] && -1) || (a[field] > b[field] && 1) || 0
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
})