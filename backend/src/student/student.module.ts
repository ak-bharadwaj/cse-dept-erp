import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [StudentController],
  providers: [StudentService, PrismaService, JwtService],
  exports: [StudentService],
})
export class StudentModule {}
