import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuditController],
  providers: [AuditService, PrismaService, JwtService],
  exports: [AuditService],
})
export class AuditModule {}
