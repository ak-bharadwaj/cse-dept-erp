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
export class FacultyService {
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

  async getFacultyList() {
    return this.prisma.faculty.findMany({
      include: {
        user: { select: { username: true } },
        Allocation: { include: { subject: true } },
        Research: true,
      },
    });
  }

  async createFaculty(data: any) {
    const username =
      data.officialEmail || data.name.toLowerCase().replace(/\s/g, '');
    const existing = await this.prisma.user.findUnique({ where: { username } });
    if (existing) throw new BadRequestException('Faculty user already exists');

    const hashedPassword = await bcrypt.hash(data.password || 'faculty123', 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          role: 'FACULTY',
        },
      });

      const faculty = await tx.faculty.create({
        data: {
          userId: user.id,
          name: data.name,
          employeeId: data.employeeId,
          officialEmail: data.officialEmail,
          mobileNumber: data.mobileNumber || '',
          designation: data.designation || 'Assistant Professor',
          joiningDate:
            data.joiningDate || new Date().toISOString().split('T')[0],
          employmentType: data.employmentType || 'PERMANENT',
          qualification: data.qualification,
          experience: parseInt(data.experience) || 0,
          workload: parseInt(data.workload) || 0,
          bio: data.bio || '',
        },
      });

      return faculty;
    });
  }

  async updateFacultyQualification(
    id: number,
    qualification: string,
    experience: number,
  ) {
    return this.prisma.faculty.update({
      where: { id },
      data: { qualification, experience },
    });
  }
}
