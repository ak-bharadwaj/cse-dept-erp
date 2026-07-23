import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './auth/jwt.strategy';

import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import { FacultyModule } from './faculty/faculty.module';
import { AcademicModule } from './academic/academic.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EventModule } from './event/event.module';
import { PlacementModule } from './placement/placement.module';
import { DocumentModule } from './document/document.module';
import { AuditModule } from './audit/audit.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'super-secret-key-change-in-prod',
      signOptions: { expiresIn: '1d' },
    }),
    AuthModule,
    StudentModule,
    FacultyModule,
    AcademicModule,
    AttendanceModule,
    EventModule,
    PlacementModule,
    DocumentModule,
    AuditModule,
  ],
  providers: [PrismaService, JwtStrategy],
})
export class AppModule {}
