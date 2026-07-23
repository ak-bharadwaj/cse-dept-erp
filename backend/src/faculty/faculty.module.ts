import { Module } from '@nestjs/common';
import { FacultyController } from './faculty.controller';
import { FacultyService } from './faculty.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [FacultyController],
  providers: [FacultyService, PrismaService, JwtService],
  exports: [FacultyService],
})
export class FacultyModule {}
