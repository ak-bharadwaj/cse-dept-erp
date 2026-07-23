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
export class AttendanceService {
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

  async recordAttendance(
    subjectId: number,
    date: string,
    records: any[],
    editorUserId: number,
  ) {
    const results = [];
    for (const record of records) {
      const existing = await this.prisma.attendance.findFirst({
        where: {
          studentId: Number(record.studentId),
          subjectId: Number(subjectId),
          date,
        },
      });

      if (existing) {
        if (existing.status !== record.status) {
          await this.logAction(
            editorUserId,
            'ATTENDANCE_UPDATE',
            `Changed student ID ${record.studentId} attendance for subject ID ${subjectId} on ${date} from ${existing.status} to ${record.status}`,
          );
          const updated = await this.prisma.attendance.update({
            where: { id: existing.id },
            data: { status: record.status },
          });
          results.push(updated);
        } else {
          results.push(existing);
        }
      } else {
        const entry = await this.prisma.attendance.create({
          data: {
            studentId: Number(record.studentId),
            subjectId: Number(subjectId),
            date,
            status: record.status,
          },
        });
        results.push(entry);
      }
    }
    return results;
  }
}
