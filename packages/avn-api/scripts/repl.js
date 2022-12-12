require('dotenv').config('../.env')

const getApi = require('../lib/avnApi').getApi
;(async () => {
  global.api = await getApi()
})()
