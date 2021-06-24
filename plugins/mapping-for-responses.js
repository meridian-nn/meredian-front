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
            let id = 0

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
                    buyerName: '',
                    executorName: '',
                    sumOplat: sumPlatFromValue,
                    sumOplatMask: this.numberToSum(sumPlatFromValue),
                    accId: 0, // value.accId
                    depName: '',
                    isDoc: false,
                    id: id
                }

                totalPaymentSum += sumPlatFromValue
                arrayOfDataToReturn.push(item)
                id += 1
            })

            toPayDataResponse.forEach((value) => {
                totalPaymentSum += value.sumOplat

                if(value.buyer) {
                  value.buyerName = value.buyer.clName8
                } else {
                  value.buyerName = ''
                }

                value.id = id
                value.sumOplatFromRequest = value.sumOplat
                value.sumOplatMask = this.numberToSum(value.sumOplat)
                value.isDoc = true
                arrayOfDataToReturn.push(value)
                id += 1
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
                    colorOfOrg = this.getColorForOrganization(data.myorgId)
                    recordOfDataset = {
                        label: data.myorgName,
                        backgroundColor: colorOfOrg,
                        data: [{
                            paymentDate: data.dataDoc,
                            sum: data.sumDoc
                        }]
                    }

                    datasets.push(recordOfDataset)
                } else {
                    let recordPaymentSumOfDataSet = recordOfDataset.data.find(item => item.paymentDate === data.dataDoc)
                    if (!recordPaymentSumOfDataSet) {
                        const paymentData = {
                            paymentDate: data.dataDoc,
                            sum: data.sumDoc
                        }
                        recordOfDataset.data.push(paymentData)
                    } else {
                        recordPaymentSumOfDataSet.sum = recordPaymentSumOfDataSet.sum + data.sumDoc
                    }
                }
            }

            for (const dataOfDataset of datasets) {
                let sumData = []
                sumData.length = labels.length

                for (const dataOfPaymentData of dataOfDataset.data) {
                    const indexOfDate = labels.indexOf(dataOfPaymentData.paymentDate)
                    sumData[indexOfDate] = dataOfPaymentData.sum
                }

                dataOfDataset.data = sumData
            }

            dataForChart.labels = labels
            dataForChart.datasets = datasets

            return dataForChart
        },

        // Функция конвертирует полученный список ролей с бэка в список
        // ролей, где поле "isHave" показывает, есть ли у переданного пользователя роль или нет
        // resposne - список ролей
        // userId - id пользователя, для которого требуется найти роли
        convertListOfRolesResponseToListOfUserRoles(response, userId) {
            let listOfRoles = []
            for (const role of response) {
                const isHaveRole = role.users.find(user => user === userId) ? true : false
                const roleForList = {
                    id: role.id,
                    isHave: isHaveRole,
                    name: role.name
                }
                listOfRoles.push(roleForList)
            }
            return listOfRoles
        },

        convertResponseFromFindPageBySearchCriteriaListToListOfMaterials(response) {
          let listOfMaterials = []
          for(const elemOfResponse of response) {
            const elemForListOfMaterials = {
              pr: elemOfResponse.prGotov,
              k: elemOfResponse.prQuality,
              account: elemOfResponse.sostSr,
              factory: elemOfResponse.nameProizv,
              date: elemOfResponse.dataTkan,
              application: elemOfResponse.numZaivk,
              supplierRequest: '',
              codeOfCommodity: elemOfResponse.mcId,
              nameOfCommodity: elemOfResponse.nameMc,
              unitOfCommodity: elemOfResponse.socrName,
              countOfCommodity: elemOfResponse.colvo,
              send: elemOfResponse.colvoOtpr,
              reserve: elemOfResponse.colvoReserv,
              need: elemOfResponse.colvoOst,
              executor: elemOfResponse.fio_Isp,
              contractor: elemOfResponse.nameKontr,
              item: elemOfResponse.tovar,
              countOfItem: elemOfResponse.colvoPr,
              correction: ''
            }
            listOfMaterials.push(elemForListOfMaterials)
          }

          return listOfMaterials
        }
    }
})
