import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { QueryScheduleDto } from './dto/query-schedule.dto';

@Controller('schedule')
@UseGuards(JwtAuthGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Request() req, @Body() createScheduleDto: CreateScheduleDto) {
    const userId = req.user?.userId;
    return this.scheduleService.create(userId, createScheduleDto);
  }

  @Get()
  findAll(@Request() req, @Query() queryDto: QueryScheduleDto) {
    const userId = req.user?.userId;
    return this.scheduleService.findAll(userId, queryDto);
  }

  @Get('date/:date')
  findByDate(@Request() req, @Param('date') date: string) {
    const userId = req.user?.userId;
    return this.scheduleService.findByDate(userId, date);
  }

  @Get('range')
  findByDateRange(
    @Request() req,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    const userId = req.user?.userId;
    return this.scheduleService.findByDateRange(userId, startDate, endDate);
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.userId;
    return this.scheduleService.findOne(userId, id);
  }

  @Patch(':id')
  update(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateScheduleDto: UpdateScheduleDto,
  ) {
    const userId = req.user?.userId;
    return this.scheduleService.update(userId, id, updateScheduleDto);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id', ParseIntPipe) id: number) {
    const userId = req.user?.userId;
    return this.scheduleService.remove(userId, id);
  }
}
