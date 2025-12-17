import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy'; // Já vamos criar esse arquivo

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'SEGREDO_SUPER_SECRETO_DO_SINDICO', // Pode mudar se quiser
      signOptions: { expiresIn: '1d' }, // Token expira em 1 dia
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Adicione JwtStrategy aqui
  exports: [AuthService],
})
export class AuthModule {}