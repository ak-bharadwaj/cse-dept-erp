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
import { PlacementService } from './placement.service';
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
export class PlacementController {
  constructor(private readonly appService: PlacementService) {}

  @Post('students/:id/placement-offer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async createPlacementOffer(@Param('id') id: string, @Body() body: any) {
    return this.appService.createPlacementOffer(parseInt(id), body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('placement-offers')
  async getPlacementOffers(@Query('studentId') studentId?: string) {
    return this.appService.getPlacementOffers(
      studentId ? parseInt(studentId) : undefined,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('placements')
  async getPlacements() {
    return this.appService.getPlacements();
  }

  @Post('placements')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async createPlacement(@Body() body: any) {
    return this.appService.createPlacement(body);
  }

  @Post('placements/:id/offer')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'HOD', 'DATA_ENTRY')
  async recordPlacementOffer(@Param('id') id: string, @Body() body: any) {
    return this.appService.recordPlacementOffer(
      parseInt(id),
      body.rollNumber,
      body.details,
    );
  }
}
