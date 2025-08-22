// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service'; // Sesuaikan path

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService) {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET environment variable is not set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Ekstrak JWT dari header Authorization (Bearer token)
      ignoreExpiration: false, // Jangan abaikan kadaluarsa token
      secretOrKey: jwtSecret
    });
  }

  // Metode `validate` akan dipanggil setelah token diverifikasi
  // Payload adalah data yang kita masukkan ke token saat login (email, sub, role)
  async validate(payload: { sub: string; email: string; role: string }) {
    // Anda bisa mengambil user dari database di sini jika perlu data user lengkap
    // Untuk saat ini, kita kembalikan user dari database
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
        // Ini bisa terjadi jika user dihapus setelah token dibuat
        return null;
    }

    return user; // Objek user ini akan ditambahkan ke `req.user`
  }
}