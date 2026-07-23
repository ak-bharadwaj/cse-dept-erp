import { Module } from '@nestjs/common';
import { PlacementController } from './placement.controller';
import { PlacementService } from './placement.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [PlacementController],
  providers: [PlacementService, PrismaService, JwtService],
  exports: [PlacementService],
})
export class PlacementModule {}
