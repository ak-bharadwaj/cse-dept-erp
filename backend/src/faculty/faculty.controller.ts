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
import { FacultyService } from './faculty.service';
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
export class FacultyController {
  constructor(private readonly appService: FacultyService) {}

  @UseGuards(JwtAuthGuard)
  @Get('faculty')
  async getFaculty() {
    return this.appService.getFacultyList();
  }

  @Post('faculty')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async createFaculty(@Body() body: CreateFacultyDto) {
    return this.appService.createFaculty(body);
  }

  @Post('faculty/:id/qualification')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  async updateFacultyQual(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateFacultyQualification(
      parseInt(id),
      body.qualification,
      body.experience,
    );
  }
}
