/* eslint-disable */
// Плагин для парсинга ответов из запросов
import Vue from 'vue'
Vue.mixin({
    methods: {
        /* Конвертация ответов запросов на получение следующих документов:
          1.Документы к оплате
          2.Оплаты по кассе
          в массив объектов для таблицы "Документы к оплате"
        */
        convertResponsesToDataForToPayTable(paymentByCashboxResponse, toPayDataResponse) {
            const objToReturn = {}
            let totalPaymentSum = 0
            const arrayOfDataToReturn = []

            paymentByCashboxResponse.forEach((value) => {
                let sumPlatFromValue = 0

                if (value.paymentOperationSums.length > 0) {
                    sumPlatFromValue = value.paymentOperationSums[0].paymentSum
                }

                const item = {
                    dataOplat: value.paymentDate,
                    nameDoc: 'Оплата по кассе',
                    namePlat: value.payer.clName,
                    prCredit: 0,
                    sumOplat: sumPlatFromValue,
                    sumOplatMask: this.numberToSum(sumPlatFromValue),
                    accId: 0, // value.accId
                    depName: '',
                    isDoc: false
                }

                totalPaymentSum += sumPlatFromValue
                arrayOfDataToReturn.push(item)
            })

            toPayDataResponse.forEach((value) => {
                totalPaymentSum += value.sumOplat
                value.sumOplatMask = this.numberToSum(value.sumOplat)
                value.isDoc = true
                arrayOfDataToReturn.push(value)
            })

            objToReturn.totalPaymentSum = totalPaymentSum
            objToReturn.arrayOfData = arrayOfDataToReturn

            return objToReturn
        },
    }
})