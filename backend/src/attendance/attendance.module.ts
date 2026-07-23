import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AttendanceController],
  providers: [AttendanceService, PrismaService, JwtService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
