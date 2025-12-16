import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, ArrayContains } from 'typeorm';

import { Schedule } from './entities/schedule.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { QueryScheduleDto } from './dto/query-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: Repository<Schedule>,
  ) {}

  async create(
    userId: number,
    createScheduleDto: CreateScheduleDto,
  ): Promise<Schedule> {
    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      userId,
      date: new Date(createScheduleDto.date),
      repeatEndDate: createScheduleDto.repeatEndDate
        ? new Date(createScheduleDto.repeatEndDate)
        : null,
      tags: createScheduleDto.tags || [],
    });

    return await this.scheduleRepository.save(schedule);
  }

  async findAll(
    userId: number,
    queryDto: QueryScheduleDto,
  ): Promise<{ data: Schedule[]; total: number }> {
    const { startDate, endDate, tag, page = 1, limit = 10 } = queryDto;
    const where: any = { userId };

    if (startDate && endDate) {
      where.date = Between(new Date(startDate), new Date(endDate));
    }

    if (tag) {
      where.tags = ArrayContains([tag]);
    }

    const [data, total] = await this.scheduleRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
      relations: ['user'],
    });

    return { data, total };
  }

  async findOne(userId: number, id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id, userId },
      relations: ['user'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    if (schedule.userId !== userId) {
      throw new ForbiddenException('Access to this schedule is forbidden');
    }
    return schedule;
  }

  async update(
    userId: number,
    id: number,
    updateScheduleDto: UpdateScheduleDto,
  ) {
    const schedule = await this.findOne(userId, id);

    return await this.scheduleRepository.save({
      ...schedule,
      ...updateScheduleDto,
      date: updateScheduleDto.date
        ? new Date(updateScheduleDto.date)
        : schedule.date,
      repeatEndDate: updateScheduleDto.repeatEndDate
        ? new Date(updateScheduleDto.repeatEndDate)
        : schedule.repeatEndDate,
    });
  }

  async remove(userId: number, id: number) {
    const schedule = await this.findOne(userId, id);

    return await this.scheduleRepository.remove(schedule);
  }

  async findByDate(userId: number, date: string): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: {
        userId,
        date: new Date(date),
      },
      order: {
        startTime: 'ASC',
      },
    });
  }

  async findByDateRange(
    userId: number,
    startDate: string,
    endData: string,
  ): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endData)),
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });
  }
}
