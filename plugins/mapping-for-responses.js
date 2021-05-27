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

        // Функция конвертации документов на оплату, полученных от бэка 
        // в объект с данными для графика, который расположен в меню реестра оплат
        convertFromPayDataResponseToDataForChart(fromPayDataResponse) {
            const dataForChart = {}
            const labels = []
            const datasets = []

            for (const data of fromPayDataResponse) {
                let record = labels.find(item => item === data.dataDoc)

                if (!record) {
                    labels.push(data.dataDoc)
                }

                let recordOfDataset = datasets.find(item => item.label === data.myorgName)

                if (!recordOfDataset) {
                    let colorOfOrg = ''
                    if (data.myorgId === 159) {
                        colorOfOrg = this.getColorForOrganization(data.myorgId)
                    } else {
                        colorOfOrg = this.getRandomColor()
                    }
                    recordOfDataset = {
                        label: data.myorgName,
                        backgroundColor: colorOfOrg,
                        data: [data.sumDoc]
                    }

                    datasets.push(recordOfDataset)
                } else {
                    recordOfDataset.data.push(data.sumDoc)
                }
            }

            dataForChart.labels = labels
            dataForChart.datasets = datasets

            return dataForChart
        },
        getRandomColor() {
            var letters = '0123456789ABCDEF';
            var color = '#';
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }
})