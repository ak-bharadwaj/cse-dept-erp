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
import { DocumentService } from './document.service';
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
export class DocumentController {
  constructor(private readonly appService: DocumentService) {}

  @UseGuards(JwtAuthGuard)
  @Get('auth/profile')
  async getProfile(@Request() req: any) {
    return this.appService.getProfile(req.user.userId);
  }

  @Post('auth/register-user')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async registerUser(@Body() body: any) {
    return this.appService.registerUser(body);
  }

  @Post('students/:id/achievement-new')
  @UseGuards(JwtAuthGuard)
  async addAchievement(@Param('id') id: string, @Body() body: any) {
    return this.appService.addAchievement(parseInt(id), body);
  }

  @Post('documents')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY', 'DATA_ENTRY')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          cb(null, `doc-${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async createDocument(@Body() body: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('File is missing');
    return this.appService.createDocument({
      title: body.title,
      category: body.category,
      description: body.description,
      filePath: file.filename,
      visibility: body.visibility,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('documents')
  async getDocuments(@Request() req: any) {
    return this.appService.getDocuments(req.user.role);
  }

  @Post('calendar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          cb(null, `calendar-${Date.now()}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadCalendar(@Body() body: any, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Calendar file is missing');
    return this.appService.uploadCalendar(body.title, file.filename);
  }

  @Get('uploads/:filename')
  @UseGuards(JwtAuthGuard)
  async getUploadedFile(@Param('filename') filename: string) {
    const filePath = join(uploadDir, filename);
    if (!fs.existsSync(filePath)) {
      throw new BadRequestException('File not found');
    }
    return { url: `/api/uploads/${filename}`, path: filePath };
  }
}
