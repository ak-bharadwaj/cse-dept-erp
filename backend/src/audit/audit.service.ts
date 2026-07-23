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
export class AuditService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

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

  async getAuditLogs() {
    return this.prisma.auditLog.findMany({
      include: { user: { select: { username: true } } },
      orderBy: { timestamp: 'desc' },
    });
  }

  async getCalendar() {
    return this.prisma.document.findMany({
      where: { category: 'ACADEMIC_CALENDAR' },
      orderBy: { createdAt: 'desc' },
    });
  }
}
