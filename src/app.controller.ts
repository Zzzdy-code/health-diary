import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    return {
      appName: this.configService.get('app.name'),
      port: this.configService.get('app.port'),
      env: this.configService.get('app.env'),
      dbHost: this.configService.get('database.host'),
      dbName: this.configService.get('database.name'),
    };
  }
}
