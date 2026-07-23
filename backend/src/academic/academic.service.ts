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
export class AcademicService {
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

  async getSubjects() {
    return this.prisma.subject.findMany();
  }

  async createSubject(data: any) {
    return this.prisma.subject.create({
      data: {
        code: data.code,
        name: data.name,
        semester: parseInt(data.semester),
      },
    });
  }

  async getAllocations() {
    return this.prisma.allocation.findMany({
      include: {
        faculty: true,
        subject: true,
      },
    });
  }

  async createAllocation(data: any) {
    return this.prisma.allocation.create({
      data: {
        facultyId: Number(data.facultyId),
        subjectId: Number(data.subjectId),
        section: data.section,
      },
    });
  }

  async importAllocations(allocations: any[]) {
    const results = [];
    for (const alloc of allocations) {
      if (!alloc.facultyName || !alloc.subjectCode) continue;

      const faculty = await this.prisma.faculty.findFirst({
        where: { name: { contains: alloc.facultyName } },
      });
      const subject = await this.prisma.subject.findUnique({
        where: { code: alloc.subjectCode },
      });

      if (faculty && subject) {
        const created = await this.prisma.allocation.create({
          data: {
            facultyId: faculty.id,
            subjectId: subject.id,
            section: alloc.section,
          },
        });
        results.push(created);
      }
    }
    return results;
  }

  async getSubjectAttendanceSummary(subjectId: number) {
    const attendance = await this.prisma.attendance.findMany({
      where: { subjectId },
      include: { student: true },
    });

    const map = new Map<
      number,
      { name: string; roll: string; total: number; present: number }
    >();
    attendance.forEach((att) => {
      const student = att.student;
      if (!map.has(student.id)) {
        map.set(student.id, {
          name: student.name,
          roll: student.rollNumber,
          total: 0,
          present: 0,
        });
      }
      const data = map.get(student.id);
      if (data) {
        data.total++;
        if (att.status === 'PRESENT') data.present++;
      }
    });

    return Array.from(map.values()).map((d) => ({
      ...d,
      percentage: d.total > 0 ? (d.present / d.total) * 100 : 0,
    }));
  }

  async createAssessment(data: any) {
    return this.prisma.assessment.create({
      data: {
        name: data.name,
        type: data.type || 'INTERNAL_EXAM',
        maxMarks: parseFloat(data.maxMarks),
        passingMarks: parseFloat(data.passingMarks || '12'),
        startDate: data.startDate || new Date().toISOString().split('T')[0],
        endDate: data.endDate || new Date().toISOString().split('T')[0],
        subjectId: Number(data.subjectId),
      },
    });
  }

  async getAssessments(subjectId?: number) {
    const where = subjectId ? { subjectId } : {};
    return this.prisma.assessment.findMany({
      where,
      include: { subject: true },
    });
  }

  async recordAssessmentMarks(assessmentId: number, marksList: any[]) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
    });
    if (!assessment) throw new NotFoundException('Assessment not found');

    const results = [];
    for (const item of marksList) {
      await this.prisma.mark.deleteMany({
        where: {
          studentId: Number(item.studentId),
          assessmentId,
        },
      });

      const entry = await this.prisma.mark.create({
        data: {
          studentId: Number(item.studentId),
          assessmentId,
          subjectId: assessment.subjectId,
          type: 'INTERNAL',
          marksObtained: parseFloat(item.marksObtained),
          maxMarks: assessment.maxMarks,
        },
      });
      results.push(entry);
    }
    return results;
  }

  async importMarks(marks: any[]) {
    const results = [];
    for (const mark of marks) {
      if (
        !mark.studentRoll ||
        !mark.subjectCode ||
        !mark.type ||
        mark.marksObtained === undefined ||
        mark.maxMarks === undefined
      )
        continue;

      const student = await this.prisma.student.findUnique({
        where: { rollNumber: mark.studentRoll },
      });
      const subject = await this.prisma.subject.findUnique({
        where: { code: mark.subjectCode },
      });

      if (student && subject) {
        await this.prisma.mark.deleteMany({
          where: {
            studentId: student.id,
            subjectId: subject.id,
            type: mark.type,
          },
        });

        const entry = await this.prisma.mark.create({
          data: {
            studentId: student.id,
            subjectId: subject.id,
            type: mark.type,
            marksObtained: parseFloat(mark.marksObtained),
            maxMarks: parseFloat(mark.maxMarks),
          },
        });
        results.push(entry);
      }
    }
    return results;
  }

  async getResultAnalytics() {
    const marks = await this.prisma.mark.findMany({
      include: { student: true, subject: true },
    });

    const studentSubjectMap = new Map<
      string,
      {
        studentId: number;
        subjectCode: string;
        subjectName: string;
        marksObtained: number;
        maxMarks: number;
        studentName: string;
        studentRoll: string;
      }
    >();

    marks.forEach((m) => {
      const key = `${m.studentId}_${m.subjectId}`;
      if (!studentSubjectMap.has(key)) {
        studentSubjectMap.set(key, {
          studentId: m.studentId,
          subjectCode: m.subject.code,
          subjectName: m.subject.name,
          marksObtained: 0,
          maxMarks: 0,
          studentName: m.student.name,
          studentRoll: m.student.rollNumber,
        });
      }
      const agg = studentSubjectMap.get(key);
      if (agg) {
        agg.marksObtained += m.marksObtained;
        agg.maxMarks += m.maxMarks;
      }
    });

    const subjectMap = new Map<
      string,
      { total: number; pass: number; code: string; name: string }
    >();
    const studentGPAMap = new Map<
      number,
      { name: string; roll: string; marksTotal: number; maxTotal: number }
    >();

    studentSubjectMap.forEach((agg) => {
      const subKey = agg.subjectCode;
      if (!subjectMap.has(subKey)) {
        subjectMap.set(subKey, {
          total: 0,
          pass: 0,
          code: agg.subjectCode,
          name: agg.subjectName,
        });
      }
      const sub = subjectMap.get(subKey);
      if (sub) {
        sub.total++;
        const percentage =
          agg.maxMarks > 0 ? (agg.marksObtained / agg.maxMarks) * 100 : 0;
        if (percentage >= 40) sub.pass++;
      }

      if (!studentGPAMap.has(agg.studentId)) {
        studentGPAMap.set(agg.studentId, {
          name: agg.studentName,
          roll: agg.studentRoll,
          marksTotal: 0,
          maxTotal: 0,
        });
      }
      const std = studentGPAMap.get(agg.studentId);
      if (std) {
        std.marksTotal += agg.marksObtained;
        std.maxTotal += agg.maxMarks;
      }
    });

    const subjectAnalytics = Array.from(subjectMap.values()).map((s) => ({
      ...s,
      passPercentage: s.total > 0 ? (s.pass / s.total) * 100 : 0,
    }));

    const toppers = Array.from(studentGPAMap.values())
      .map((s) => ({
        ...s,
        cgpa:
          s.maxTotal > 0
            ? ((s.marksTotal / s.maxTotal) * 10).toFixed(2)
            : '0.00',
      }))
      .sort((a, b) => parseFloat(b.cgpa) - parseFloat(a.cgpa))
      .slice(0, 5);

    return { subjectAnalytics, toppers };
  }

  async getResearchRecords() {
    return this.prisma.research.findMany({
      include: { faculty: true },
    });
  }

  async createResearch(data: any) {
    return this.prisma.research.create({
      data: {
        facultyId: Number(data.facultyId),
        type: data.type,
        title: data.title,
        details: data.details,
      },
    });
  }
}
