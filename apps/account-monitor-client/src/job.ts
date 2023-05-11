import { IReportParams } from './reportService'
import { ReportStrategy } from './reportService'

enum JobStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped'
}

export class Job {
  status: JobStatusEnum = JobStatusEnum.STOPPED
  reportStrategy: ReportStrategy

  constructor(reportParams: IReportParams, reportStrategy: ReportStrategy) {
    this.reportStrategy = reportStrategy
    this.start(reportParams)
  }

  start(reportParams: IReportParams) {
    this.reportStrategy.start(reportParams)
    this.status = JobStatusEnum.RUNNING
  }

  stop() {
    this.reportStrategy.stop()
    this.status = JobStatusEnum.STOPPED
  }
}

export class JobManager {
  private readonly jobs = new Map<number, Job>()

  createNewJob(reportParams: IReportParams, reportStrategy: ReportStrategy) {
    const jobIndex = this.jobs.size
    this.jobs.set(jobIndex, new Job(reportParams, reportStrategy))
  }

  stopJob(id: number) {
    const job = this.jobs.get(id)
    if (job) {
      job.stop()
    }
  }

  removeJob(id: number) {
    this.stopJob(id)
    this.jobs.delete(id)
  }

  listJobs() {
    return Array.from(this.jobs.values())
  }
}
