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
                    accId: value.acc.id,
                    depName: '',
                    isDoc: false,
                    keyId: id,
                    id: value.id
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

                value.keyId = id
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
                const isHaveRole = !!role.users.find(user => user === userId)
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
        },

      convertResponsePaymentsByCashboxToDataForTable(response, operationTypes) {
        const arrayOfData = []
        for (const item of response) {
          let operationSum = 0
          let groupName = ''

          if (item.paymentOperationSums.length > 0) {
            operationSum = item.paymentOperationSums[0].paymentSum
            groupName = operationTypes.find(operation => operation.id === item.paymentOperationSums[0].paymentOperationTypeId)
          }

          const data = {
            paymentDate: item.paymentDate,
            orgName: item.payer.clName,
            operationSum: this.numberToSum(operationSum),
            groupName: groupName.name,
            comment: item.comment
          }

          arrayOfData.push(data)
        }

        return arrayOfData
      },

      async convertVNPLPaymentByCashboxAndDocsToPayResponsesToDataForTable(vnplDocs, paymentsByCashbox, docsToPay, chosenDate) {
        const dataForTable = []
        let totalSumOplat = 0
        const accsInDataForTable = []


        for (const vnplDoc of vnplDocs) {
          if (!vnplDoc.myOrg) {
            vnplDoc.payerName = ''
          } else {
            vnplDoc.payerName = vnplDoc.myOrg.clName8
          }

          if(!vnplDoc.sumPaid) {
            vnplDoc.sumPaid = 0
          }

          const data = {
            accId: vnplDoc.accId,
            dataDoc: vnplDoc.dataDoc,
            nameDoc: vnplDoc.nameDoc,
            sumPaid: this.numberToSum(vnplDoc.sumPaid),
            sumPaidNumber: vnplDoc.sumPaid,
            myorgName: vnplDoc.payerName,
            executorName: vnplDoc.executorName,
            depName: vnplDoc.depName,
            partialPayment: (vnplDoc.sumDoc !== vnplDoc.sumPaid) ? 'Да' : 'Нет',
            prim: vnplDoc.prim
          }
          dataForTable.push(data)
          totalSumOplat += vnplDoc.sumPaid

          await this.searchAccIfInAccsinDataForTable(accsInDataForTable, vnplDoc.accId, chosenDate)
        }

        for (const paymentByCashbox of paymentsByCashbox) {
          const data = {
            accId: paymentByCashbox.acc.id,
            dataDoc: paymentByCashbox.paymentDate,
            nameDoc: 'Оплата по кассе от ' + paymentByCashbox.paymentDate,
            sumPaid: this.numberToSum(paymentByCashbox.toPaySum),
            sumPaidNumber: paymentByCashbox.toPaySum,
            myorgName: paymentByCashbox.payer.clName8,
            executorName: '',
            depName: '',
            partialPayment: 'Нет',
            prim: paymentByCashbox.comment
          }
          dataForTable.push(data)
          totalSumOplat += paymentByCashbox.toPaySum

          await this.searchAccIfInAccsinDataForTable(accsInDataForTable, paymentByCashbox.acc.id, chosenDate)
        }

        for (const docToPay of docsToPay) {
          if(!docToPay.sumOplat) {
            docToPay.sumOplat = 0
          }

          const data = {
            accId: docToPay.accId,
            dataDoc: docToPay.dataOplat,
            nameDoc: docToPay.nameDoc,
            sumPaid: this.numberToSum(docToPay.sumOplat),
            sumPaidNumber: docToPay.sumOplat,
            myorgName: docToPay.namePlat1,
            executorName: docToPay.executorName,
            depName: docToPay.depName,
            partialPayment: 'Да',
            // (docToPay.sumDoc !== docToPay.sumOplat) ? 'Да' : 'Нет',
            prim: docToPay.prim
          }
          dataForTable.push(data)
          totalSumOplat +=docToPay.sumOplat

          await this.searchAccIfInAccsinDataForTable(accsInDataForTable, docToPay.accId, chosenDate)
        }
        totalSumOplat = this.numberToSum(totalSumOplat)

        return {
          dataForTable,
          totalSumOplat,
          accsInDataForTable
        }
      },

      async searchAccIfInAccsinDataForTable(accsInDataForTable, accId, chosenDate) {
        const accInDataForTable = accsInDataForTable.find(elem => elem.acc.id === accId)

        if(accInDataForTable) {
          return
        }

        const searchCriteriasForAcc = this.createCriteriasToSearchAcc(chosenDate, accId)
        const acc = await this.$api.paymentAccounts.findBySearchCriteriaList(searchCriteriasForAcc)

        if(acc && acc.length > 0) {
          accsInDataForTable.push(acc[0])
        }
      },

      convertMoneyDistributionByDepToDataForTable(moneyDistributionByDeps, moneyDistributionByDivisions, departments) {
          const departmentsDataTable = []
            for (const department of departments) {
              let distributionSum = 0
              let notDistributedSum = 0
              const searchedElemByDeps = moneyDistributionByDeps.find(elem => elem.department.id === department.id)

              if(searchedElemByDeps) {
                distributionSum = searchedElemByDeps.distributionSum || 0
              }

              const searchedElemByDivisions = moneyDistributionByDivisions.find(elem => elem['department.parentId'] === department.id)

              if(searchedElemByDivisions) {
                notDistributedSum = distributionSum - (searchedElemByDivisions.sum_distributionSum || 0)
              } else {
                notDistributedSum = distributionSum
              }

              const dataTableElem = {
                name: department.nameViddoc,
                distributionSum: distributionSum,
                distributionSumMask: this.numberToSum(distributionSum),
                notDistributedSum: notDistributedSum,
                notDistributedSumMask: this.numberToSum(notDistributedSum)
              }

              departmentsDataTable.push(dataTableElem)
            }
          return departmentsDataTable
      },

      convertMoneyDistributionsByDivisionsInDataForTable(divisions, moneyDistribution, date) {
        const divisionsDataTable = []
        let id = 1
        for (const division of divisions) {
          const searchedElement = moneyDistribution.find(elem => elem.department.id === division.id)
          if (searchedElement) {
            searchedElement.keyId = id
            searchedElement.distributionSum = searchedElement.distributionSum || 0
            divisionsDataTable.push(searchedElement)
          } else {
            const dataTableElem = {
              keyId: id,
              department: division,
              distributionSum: 0,
              distributionDate: date,
              note: ''
            }
            divisionsDataTable.push(dataTableElem)
          }
          id++
        }
        return divisionsDataTable
      }
    }


})
