import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import {
  LoginDto,
  CreateStudentDto,
  CreateFacultyDto,
  CreateSubjectDto,
  CreateAllocationDto,
  CreateAssessmentDto,
  CreateResearchDto,
} from '../dto';
import * as fs from 'fs';

const uploadDir = join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

@Controller('api')
export class AttendanceController {
  constructor(private readonly appService: AttendanceService) {}

  @Post('attendance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  async recordAttendance(@Body() body: any, @Request() req: any) {
    return this.appService.recordAttendance(
      body.subjectId,
      body.date,
      body.records,
      req.user.userId,
    );
  }
}
