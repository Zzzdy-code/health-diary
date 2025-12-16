import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsArray,
  IsInt,
  IsEnum,
  Min,
  Max,
  ArrayMaxSize,
} from 'class-validator';

import { RepeatType } from 'src/database/entities/schedule.entity';

export class CreateScheduleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  isAllDay?: boolean;

  @IsString()
  @IsOptional()
  location?: string;

  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  tags?: string[];

  @IsInt()
  @Min(0)
  @Max(1440)
  @IsOptional()
  reminderMinutes?: number;

  @IsEnum(RepeatType)
  @IsOptional()
  repeatType?: RepeatType;

  @IsDateString()
  @IsOptional()
  repeatEndDate?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
