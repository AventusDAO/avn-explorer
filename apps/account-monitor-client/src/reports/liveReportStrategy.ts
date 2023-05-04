import { IServiceDependencies, ReportParams, ReportStrategy } from './topAccountsVolumeStrategy'

export class LiveReport implements ReportStrategy {
  constructor(private readonly dependencies: IServiceDependencies) {}

  async generateReport(params: ReportParams) {
    const { dbClient, messageSender } = this.dependencies
  }
}
