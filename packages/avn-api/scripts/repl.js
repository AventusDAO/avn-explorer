/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
require('dotenv').config('../.env')
const getApi = require('../lib/avnApi').getApi

const configure = async () => {
  global.api = await getApi()
}

configure()
