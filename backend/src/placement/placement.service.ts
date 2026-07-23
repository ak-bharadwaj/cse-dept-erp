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
export class PlacementService {
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

  async getPlacements() {
    return this.prisma.placement.findMany({
      orderBy: { driveDate: 'desc' },
    });
  }

  async createPlacement(data: any) {
    return this.prisma.placement.create({
      data: {
        companyName: data.companyName,
        driveDate: data.driveDate,
        eligibility: data.eligibility,
        status: 'UPCOMING',
      },
    });
  }

  async recordPlacementOffer(id: number, rollNumber: string, details: string) {
    const placement = await this.prisma.placement.findUnique({ where: { id } });
    if (!placement) throw new NotFoundException('Placement drive not found');

    const newOffer = `${rollNumber}:${details}`;
    const offers = placement.offers
      ? `${placement.offers};${newOffer}`
      : newOffer;
    return this.prisma.placement.update({
      where: { id },
      data: { offers, status: 'COMPLETED' },
    });
  }

  async createPlacementOffer(studentId: number, data: any) {
    return this.prisma.placementOffer.create({
      data: {
        studentId,
        companyName: data.companyName,
        jobRole: data.jobRole,
        offerType: data.offerType,
        packageLpa: parseFloat(data.packageLpa),
        offerDate: data.offerDate,
        status: data.status || 'SELECTED',
        isFinal: data.isFinal || false,
      },
    });
  }

  async getPlacementOffers(studentId?: number) {
    const where = studentId ? { studentId } : {};
    return this.prisma.placementOffer.findMany({
      where,
      include: { student: true },
    });
  }
}
