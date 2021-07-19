import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/ru'

Vue.filter('formatDate', (date, format) => {
  const formattedDate = formatDate(date, format)

  return formattedDate
})

function formatDate(date, formatting) {
  console.log(date, formatting)
  return dayjs(date).locale('ru').format(formatting)
}
