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
import { AuditService } from './audit.service';
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
export class AuditController {
  constructor(private readonly appService: AuditService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('audit-logs')
  @Roles('SUPER_ADMIN', 'HOD')
  async getAuditLogs() {
    return this.appService.getAuditLogs();
  }

  @UseGuards(JwtAuthGuard)
  @Get('calendar')
  async getCalendar() {
    return this.appService.getCalendar();
  }
}
