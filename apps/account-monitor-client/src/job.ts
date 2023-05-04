import { CronJob } from 'cron'

enum JobStatusEnum {
  RUNNING = 'running',
  STOPPED = 'stopped'
}

export class Job {
  //   id: string
  status: JobStatusEnum = JobStatusEnum.STOPPED
  job: CronJob

  constructor(reportParams: any, generateReportFunction: any) {
    // @ts-nocheck
    this.job = new CronJob(reportParams.frequency, () => {
      generateReportFunction(reportParams)
    })
    this.status = JobStatusEnum.RUNNING
    this.job.start()
  }

  stop() {
    this.status = JobStatusEnum.STOPPED
    this.job.stop()
  }
}

export class JobManager {
  private readonly jobs = new Map<number, Job>()

  createNewJob(reportParams: any, generateReportFunction: any) {
    const jobIndex = this.jobs.size
    this.jobs.set(jobIndex, new Job(reportParams, generateReportFunction))
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
