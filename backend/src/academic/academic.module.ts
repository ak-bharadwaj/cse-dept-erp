import { Module } from '@nestjs/common';
import { AcademicController } from './academic.controller';
import { AcademicService } from './academic.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AcademicController],
  providers: [AcademicService, PrismaService, JwtService],
  exports: [AcademicService],
})
export class AcademicModule {}
