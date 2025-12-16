import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}

@Entity('schedules')
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time', nullable: true })
  startTime: string | null;

  @Column({ type: 'time', nullable: true })
  endTime: string | null;

  @Column({ type: 'boolean', default: false })
  isAllDay: boolean;

  @Column({ type: 'text', nullable: true })
  location: string | null;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'int', nullable: true })
  reminderMinutes: number | null;

  @Column({ type: 'enum', enum: RepeatType, default: RepeatType.NONE })
  repeatType: RepeatType;

  @Column({ type: 'date', nullable: true })
  repeatEndDate: Date | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
