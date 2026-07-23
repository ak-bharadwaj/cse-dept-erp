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
import { AcademicService } from './academic.service';
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
export class AcademicController {
  constructor(private readonly appService: AcademicService) {}

  @UseGuards(JwtAuthGuard)
  @Get('subjects')
  async getSubjects() {
    return this.appService.getSubjects();
  }

  @Post('subjects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async createSubject(@Body() body: CreateSubjectDto) {
    return this.appService.createSubject(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('allocations')
  async getAllocations() {
    return this.appService.getAllocations();
  }

  @Post('allocations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async createAllocation(@Body() body: CreateAllocationDto) {
    return this.appService.createAllocation(body);
  }

  @Post('allocations/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async importAllocations(@Body() body: any) {
    return this.appService.importAllocations(body.allocations);
  }

  @UseGuards(JwtAuthGuard)
  @Get('attendance/subject/:subjectId')
  async getSubjectAttendanceSummary(@Param('subjectId') subjectId: string) {
    return this.appService.getSubjectAttendanceSummary(parseInt(subjectId));
  }

  @Post('assessments')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async createAssessment(@Body() body: CreateAssessmentDto) {
    return this.appService.createAssessment(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('assessments')
  async getAssessments(@Query('subjectId') subjectId?: string) {
    return this.appService.getAssessments(
      subjectId ? parseInt(subjectId) : undefined,
    );
  }

  @Post('assessments/:id/marks')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  async recordAssessmentMarks(@Param('id') id: string, @Body() body: any) {
    return this.appService.recordAssessmentMarks(parseInt(id), body.marks);
  }

  @Post('marks/import')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async importMarks(@Body() body: any) {
    return this.appService.importMarks(body.marks);
  }

  @UseGuards(JwtAuthGuard)
  @Get('marks/analytics')
  async getResultAnalytics() {
    return this.appService.getResultAnalytics();
  }

  @UseGuards(JwtAuthGuard)
  @Get('research')
  async getResearchRecords() {
    return this.appService.getResearchRecords();
  }

  @Post('research')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  async createResearch(@Body() body: CreateResearchDto) {
    return this.appService.createResearch(body);
  }
}
