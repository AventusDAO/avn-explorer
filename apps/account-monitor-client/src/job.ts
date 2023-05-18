import { IReportParams, ReportStrategy } from './reportService'

enum JobStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped'
}

export class Job {
  status: JobStatusEnum = JobStatusEnum.STOPPED
  reportStrategy: ReportStrategy

  constructor(reportParams: IReportParams, reportStrategy: ReportStrategy) {
    this.reportStrategy = reportStrategy
  }

  async start(reportParams: IReportParams): Promise<void> {
    await this.reportStrategy.generateReport(reportParams)
    this.reportStrategy.start(reportParams)
    this.status = JobStatusEnum.RUNNING
  }

  stop(): void {
    this.reportStrategy.stop()
    this.status = JobStatusEnum.STOPPED
  }
}

export class JobManager {
  private readonly jobs = new Map<number, Job>()

  async createNewJob(reportParams: IReportParams, reportStrategy: ReportStrategy): void {
    const jobIndex = this.jobs.size
    const job = new Job(reportParams, reportStrategy)
    await job.start(reportParams)
    this.jobs.set(jobIndex, job)
  }

  stopJob(id: number): void {
    const job = this.jobs.get(id)
    if (job) {
      job.stop()
    }
  }

  removeJob(id: number): void {
    this.stopJob(id)
    this.jobs.delete(id)
  }

  listJobs(): Job[] {
    return Array.from(this.jobs.values())
  }
}
