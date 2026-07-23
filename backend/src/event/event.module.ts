import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [EventController],
  providers: [EventService, PrismaService, JwtService],
  exports: [EventService],
})
export class EventModule {}
