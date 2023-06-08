/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config('.env')

const dropEs = async () => {
  console.log(`Removing ElasticSearch indices...`)
  const { ES_URL, ES_BLOCKS_INDEX, ES_EXTRINSICS_INDEX, ES_EVENTS_INDEX } = process.env
  if (ES_URL && ES_BLOCKS_INDEX && ES_EXTRINSICS_INDEX && ES_EVENTS_INDEX) {
    console.log('Clearing ElasticSearch indices...')
    const endpoints = [ES_BLOCKS_INDEX, ES_EXTRINSICS_INDEX, ES_EVENTS_INDEX].map(
      e => `${ES_URL}/${e}`
    )
    const deleteRequests = endpoints.map(async e => await fetch(e, { method: 'DELETE' }))
    await Promise.all(deleteRequests)
  }
  console.log(`Removed.`)
}

;(async () => {
  await dropEs()
})()
