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
import { EventService } from './event.service';
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
export class EventController {
  constructor(private readonly appService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get('events')
  async getEvents() {
    return this.appService.getEvents();
  }

  @Post('events')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  async createEvent(@Body() body: any) {
    return this.appService.createEvent(body);
  }

  @Post('events/:id/photo')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'FACULTY')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `event-${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadEventPhoto(@Param('id') id: string, @UploadedFile() file: any) {
    if (!file) throw new BadRequestException('Photo is missing');
    return this.appService.addEventPhoto(parseInt(id), file.filename);
  }

  @Post('events/:id/register')
  @UseGuards(JwtAuthGuard)
  async registerEventParticipant(@Param('id') id: string, @Body() body: any) {
    return this.appService.registerEventParticipant(
      parseInt(id),
      body.rollNumber,
    );
  }
}
