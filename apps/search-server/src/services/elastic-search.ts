import axios, { AxiosResponse } from 'axios'
import { config } from '../config'
import { EsRequestPayload, EsResponse } from '../types'
import { getLogger } from '../utils'
const logger = getLogger('elastic-search')

export class ElasticSearch {
  #baseUrl: string
  constructor(baseUrl: string = config.db.baseUrl) {
    this.#baseUrl = baseUrl
  }

  async post<D>(endpoint: string, data: EsRequestPayload): Promise<AxiosResponse<EsResponse<D>>> {
    logger.info(`POST /${endpoint}`)
    logger.verbose(`body=${JSON.stringify(data)}`)
    return await axios.post<EsResponse<D>>(`${this.#baseUrl}/${endpoint}`, data)
  }

  async postGeneric<D>(endpoint: string, data: EsRequestPayload): Promise<AxiosResponse<D>> {
    logger.info(`POST /${endpoint}`)
    logger.verbose(`body=${JSON.stringify(data)}`)
    return await axios.post<D>(`${this.#baseUrl}/${endpoint}`, data)
  }

  async get<D>(endpoint: string): Promise<AxiosResponse<EsResponse<D>>> {
    logger.info(`GET /${endpoint}`)
    return await axios.get<EsResponse<D>>(`${this.#baseUrl}/${endpoint}`)
  }
}

export const elasticSearch = new ElasticSearch()
