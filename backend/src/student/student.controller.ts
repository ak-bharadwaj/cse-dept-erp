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
import { StudentService } from './student.service';
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
export class StudentController {
  constructor(private readonly appService: StudentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('students')
  async searchStudents(
    @Query('query') query?: string,
    @Query('status') status?: string,
    @Query('batch') batch?: string,
  ) {
    return this.appService.searchStudents(query, status, batch);
  }

  @UseGuards(JwtAuthGuard)
  @Get('students/:id')
  async getStudentById(@Param('id') id: string) {
    return this.appService.getStudentById(parseInt(id));
  }

  @Post('students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async createStudent(@Body() body: CreateStudentDto) {
    return this.appService.createStudent(body);
  }

  @Post('students/:id/profile')
  @UseGuards(JwtAuthGuard)
  async updateStudentProfile(@Param('id') id: string, @Body() body: any) {
    return this.appService.updateStudentProfile(parseInt(id), body);
  }

  @Post('students/:id/verify')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async verifyStudentProfile(@Param('id') id: string, @Body() body: any) {
    return this.appService.verifyStudentProfile(parseInt(id), body.action);
  }

  @Post('students/:id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  async archiveStudent(@Param('id') id: string, @Body() body: any) {
    return this.appService.archiveStudent(parseInt(id), body.status);
  }

  @Post('students/:id/upload-doc')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
    }),
  )
  async uploadStudentDoc(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('File is missing');
    return { filename: file.filename, path: `/api/uploads/${file.filename}` };
  }

  @UseGuards(JwtAuthGuard)
  @Get('attendance/student/:studentId')
  async getStudentAttendance(@Param('studentId') studentId: string) {
    return this.appService.getStudentAttendance(parseInt(studentId));
  }

  @UseGuards(JwtAuthGuard)
  @Get('marks/student/:studentId')
  async getStudentMarks(@Param('studentId') studentId: string) {
    return this.appService.getStudentMarks(parseInt(studentId));
  }
}
