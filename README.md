# foxPro

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```
# install components
$yarn add --dev vue-tables-2

$ yarn add --dev @nuxt/components

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

# Основные компоненты 

- plugins/criterias-for-requests - плагин, в котором находятся методы для создания критериев для запросов типа "FindBySearchCriteria" и "FindBySearchCriterias"

- plugins/mapping-for-responses - плагин, в котором хранятся методы для парсинга ответов запросов, отправленных на бэк

- plugins/mapping-for-queryes-params - плагин, в котором хранятся методы для создания параметров для запросов 

- plugins/number-to-sum - плагин для отображения числа как денежной суммы

- plugins/custom-compare - плагин с кастомной сортировкой

- plugins/id-of-forms-elements - плагин с геттерами айдишников элементов форм для получения пользовательских фильтров из базы

