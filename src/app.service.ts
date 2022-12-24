import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class AppService {
  constructor(private readonly schedule: SchedulerRegistry) {}

  private readonly logger = new Logger(AppService.name);

  // @Cron('1200 * * * * *', {
  //   name: 'myJob',
  // })
  handleCron() {
    this.logger.debug('Called when the configured cron expression is emitted');
  }

  // get last day of month
  getLastDayOfMonth() {
    const job = this.schedule.getCronJob('myJob');
    job.stop();
    // get human-readable date from cron job and format h:mm day/month/year

    const date = new Date(job.nextDates().toString());
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    const seconds = date.getSeconds();
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  }
}
