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
export class DocumentService {
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

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Student: {
          include: {
            Achievement: true,
            PlacementOffer: true,
            Attendance: { include: { subject: true } },
            Mark: { include: { subject: true, assessment: true } },
          },
        },
        Faculty: {
          include: {
            Allocation: { include: { subject: true } },
            Research: true,
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async registerUser(data: any) {
    const existing = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existing) throw new BadRequestException('Username already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        role: data.role,
      },
    });

    return { id: user.id, username: user.username, role: user.role };
  }

  async addAchievement(studentId: number, data: any) {
    const student = await this.prisma.student.findUnique({
      where: { id: studentId },
    });
    if (!student) throw new NotFoundException('Student not found');

    return this.prisma.achievement.create({
      data: {
        studentId,
        title: data.title,
        category: data.category,
        organizer: data.organizer,
        date: data.date,
        description: data.description || '',
        level: data.level || 'COLLEGE',
        position: data.position || 'PARTICIPANT',
        proofFile: data.proofFile || '',
      },
    });
  }

  async createDocument(data: any) {
    return this.prisma.document.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description || '',
        filePath: data.filePath,
        visibility: data.visibility || 'PUBLIC',
      },
    });
  }

  async getDocuments(role: string) {
    const where: any = {};
    if (role === 'STUDENT') {
      where.visibility = { in: ['STUDENTS', 'PUBLIC'] };
    } else if (role === 'FACULTY') {
      where.visibility = { in: ['FACULTY_ONLY', 'STUDENTS', 'PUBLIC'] };
    }
    // HOD and SUPER_ADMIN see all documents
    return this.prisma.document.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async uploadCalendar(title: string, filePath: string) {
    return this.prisma.document.create({
      data: {
        title,
        category: 'ACADEMIC_CALENDAR',
        filePath,
        visibility: 'PUBLIC',
      },
    });
  }
}
