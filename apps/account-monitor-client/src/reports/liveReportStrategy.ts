import { IServiceDependencies, IReportParams, ReportStrategy } from '../reportService'

export class LiveReport implements ReportStrategy {
  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: IReportParams) {
    const { dbClient, messageSender } = this.dependencies
  }
}
