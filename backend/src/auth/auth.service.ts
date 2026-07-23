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
export class AuthService {
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

  async login(username: string, password_raw: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) {
      const count = await this.prisma.user.count();
      if (count === 0 && username === 'admin') {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const newUser = await this.prisma.user.create({
          data: {
            username: 'admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
          },
        });
        await this.logAction(
          newUser.id,
          'USER_AUTO_SEED',
          'Auto seeded admin account',
        );
        const payload = {
          username: newUser.username,
          sub: newUser.id,
          role: newUser.role,
        };
        return {
          accessToken: this.jwtService.sign(payload),
          user: {
            id: newUser.id,
            username: newUser.username,
            role: newUser.role,
          },
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password_raw, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: user.username, sub: user.id, role: user.role };
    await this.logAction(user.id, 'USER_LOGIN', `User ${username} logged in`);

    return {
      accessToken: this.jwtService.sign(payload),
      user: { id: user.id, username: user.username, role: user.role },
    };
  }
}
