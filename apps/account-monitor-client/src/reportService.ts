import {
  IServiceDependencies,
  ReportParams,
  ReportStrategy,
  TopVolumeMoveReport
} from './reports/topAccountsVolumeStrategy.js'
import { LiveReport } from './reports/liveReportStrategy.js'

export enum ReportStrategyEnum {
  TopVolumeMoveReport = 'TopVolumeMoveReport',
  LiveReport = 'LiveReport'
}

class ReportService {
  private reportStrategy: ReportStrategy | null = null

  constructor(private readonly dependencies: IServiceDependencies) {}

  getReportStrategy() {
    return this.reportStrategy
  }

  setReportStrategy(reportStrategy: ReportStrategyEnum) {
    if (reportStrategy === ReportStrategyEnum.TopVolumeMoveReport) {
      this.reportStrategy = new TopVolumeMoveReport(this.dependencies)
    }

    if (reportStrategy === ReportStrategyEnum.LiveReport) {
      this.reportStrategy = new LiveReport(this.dependencies)
    }
  }

  generateReport = async (params: ReportParams) => {
    if (this.reportStrategy) await this.reportStrategy.generateReport(params)
  }
}

export default ReportService
