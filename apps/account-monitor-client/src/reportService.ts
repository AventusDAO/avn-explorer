import { TopVolumeMoveReport } from './reports/topAccountsVolumeStrategy'
import { LiveReport } from './reports/liveReportStrategy'
import DbClient from './dbClient'

export interface IServiceDependencies {
  dbClient: DbClient
  messageSender: (msg: string) => Promise<void>
}

export enum ReportStrategyEnum {
  TopVolumeMoveReport = 'TopVolumeMoveReport',
  LiveReport = 'LiveReport'
}

export interface IReportParams {
  period: string
  frequency: string
  token?: string
  filter?: { type: string; value: string }
  minAmount: number
  interestingAccounts: string[]
  minVolume: number
  minTransactions: number
}

export interface ReportStrategy {
  generateReport: (params: IReportParams) => Promise<void>
  start: (params?: IReportParams) => void
  stop: () => void
}

class ReportService {
  private reportStrategy: ReportStrategy | null = null

  constructor(public readonly dependencies: IServiceDependencies) {}

  getReportStrategy(): ReportStrategy | null {
    return this.reportStrategy
  }

  setReportStrategy(reportStrategy: ReportStrategyEnum): void {
    if (reportStrategy === ReportStrategyEnum.TopVolumeMoveReport) {
      this.reportStrategy = new TopVolumeMoveReport(this.dependencies)
    }

    if (reportStrategy === ReportStrategyEnum.LiveReport) {
      this.reportStrategy = new LiveReport(this.dependencies)
    }
  }

  generateReport = async (params: IReportParams): Promise<void> => {
    if (!this.reportStrategy) {
      throw new Error('Report strategy not set')
    }

    await this.reportStrategy.generateReport(params)
  }

  startReport(): void {
    if (!this.reportStrategy) {
      throw new Error('Report strategy not set')
    }

    this.reportStrategy.start()
  }

  stopReport(): void {
    if (!this.reportStrategy) {
      throw new Error('Report strategy not set')
    }

    this.reportStrategy.stop()
  }
}

export default ReportService
