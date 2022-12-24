import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Public()
@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getCronJob() {
    return this.appService.getLastDayOfMonth();
  }
}
