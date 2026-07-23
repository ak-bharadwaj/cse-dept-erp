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
export class StudentService {
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

  async searchStudents(query?: string, status?: string, batch?: string) {
    const where: any = {};
    if (status) where.status = status;
    if (batch) where.batch = batch;
    if (query) {
      where.OR = [
        { name: { contains: query } },
        { rollNumber: { contains: query } },
      ];
    }

    return this.prisma.student.findMany({
      where,
      include: {
        user: { select: { username: true, role: true } },
        Achievement: true,
        PlacementOffer: true,
      },
    });
  }

  async getStudentById(id: number) {
    const student = await this.prisma.student.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, role: true } },
        Attendance: { include: { subject: true } },
        Mark: { include: { subject: true, assessment: true } },
        Achievement: true,
        PlacementOffer: true,
      },
    });
    if (!student) throw new NotFoundException('Student not found');
    return student;
  }

  async createStudent(data: any) {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: data.rollNumber },
    });
    if (existingUser)
      throw new BadRequestException(
        'User with this roll number already exists',
      );

    const existingStudent = await this.prisma.student.findUnique({
      where: { rollNumber: data.rollNumber },
    });
    if (existingStudent)
      throw new BadRequestException(
        'Student with this roll number already exists',
      );

    const hashedPassword = await bcrypt.hash(data.password || 'student123', 10);

    return this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: data.rollNumber,
          password: hashedPassword,
          role: 'STUDENT',
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          name: data.name,
          rollNumber: data.rollNumber,
          batch: data.batch,
          section: data.section,
          guardianName: data.guardianName,
          status: 'PENDING_PROFILE', // Satisfies onboarding lifecycle starting state
        },
      });

      return student;
    });
  }

  async updateStudentProfile(id: number, profileData: any) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    const updated = await this.prisma.student.update({
      where: { id },
      data: {
        dob: profileData.dob,
        gender: profileData.gender,
        bloodGroup: profileData.bloodGroup,
        aadhaarNumber: profileData.aadhaarNumber,
        category: profileData.category,
        caste: profileData.caste,
        religion: profileData.religion,
        nationality: profileData.nationality,
        personalEmail: profileData.personalEmail,
        mobileNumber: profileData.mobileNumber,
        altMobileNumber: profileData.altMobileNumber,
        permanentAddress: profileData.permanentAddress,
        currentAddress: profileData.currentAddress,
        fatherName: profileData.fatherName,
        motherName: profileData.motherName,
        parentMobileNumber: profileData.parentMobileNumber,
        parentEmail: profileData.parentEmail,
        academicBackground: profileData.academicBackground,
        status: 'SUBMITTED', // Moves state to profile completed awaiting review
      },
    });

    await this.logAction(
      student.userId,
      'STUDENT_PROFILE_SUBMIT',
      `Submitted profile for verification`,
    );
    return updated;
  }

  async verifyStudentProfile(id: number, action: 'APPROVE' | 'REJECT') {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Student not found');

    const nextStatus = action === 'APPROVE' ? 'ACTIVE' : 'PENDING_PROFILE';
    const updated = await this.prisma.student.update({
      where: { id },
      data: { status: nextStatus },
    });

    return updated;
  }

  async archiveStudent(id: number, status: string) {
    const student = await this.prisma.student.update({
      where: { id },
      data: { status },
    });
    return student;
  }

  async getStudentAttendance(studentId: number) {
    return this.prisma.attendance.findMany({
      where: { studentId },
      include: { subject: true },
    });
  }

  async getStudentMarks(studentId: number) {
    return this.prisma.mark.findMany({
      where: { studentId },
      include: { subject: true, assessment: true },
    });
  }
}
