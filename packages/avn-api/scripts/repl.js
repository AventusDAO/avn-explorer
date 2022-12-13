require('dotenv').config('../.env')
const getApi = require('../lib/avnApi').getApi

const configure = async () => {
  global.api = await getApi()
}

configure()
