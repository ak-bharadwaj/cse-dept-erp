import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class EventService {
  private async logAction(userId: number, action: string, details: any) {
    await this.prisma.auditLog.create({
      data: {
        userId,
        action,
        details:
          typeof details === 'string' ? details : JSON.stringify(details),
      },
    });
  }

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async getEvents() {
    return this.prisma.event.findMany({
      orderBy: { date: 'desc' },
    });
  }

  async createEvent(data: any) {
    return this.prisma.event.create({
      data: {
        title: data.title,
        date: data.date,
        description: data.description,
      },
    });
  }

  async addEventPhoto(id: number, filename: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const photos = event.photographs
      ? `${event.photographs},${filename}`
      : filename;
    return this.prisma.event.update({
      where: { id },
      data: { photographs: photos },
    });
  }

  async registerEventParticipant(id: number, rollNumber: string) {
    const event = await this.prisma.event.findUnique({ where: { id } });
    if (!event) throw new NotFoundException('Event not found');

    const participants = event.participants
      ? `${event.participants},${rollNumber}`
      : rollNumber;
    return this.prisma.event.update({
      where: { id },
      data: { participants },
    });
  }
}
