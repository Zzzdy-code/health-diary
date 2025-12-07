import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppService } from './app.service';
import { User } from './database/entities/user.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  @Get('db-test')
  async testDatabase() {
    try {
      const userCount = await this.userRepository.count();
      return {
        success: true,
        message: 'Database connection successful!',
        userCount,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Database connection failed!',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
