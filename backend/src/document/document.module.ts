import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService, PrismaService, JwtService],
  exports: [DocumentService],
})
export class DocumentModule {}
