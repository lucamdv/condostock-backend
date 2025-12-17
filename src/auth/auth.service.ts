import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  // Validar usuário (AGORA COM CPF)
  async validateUser(cpf: string, pass: string): Promise<any> {
    // Busca o usuário pelo CPF no banco de dados
    const user = await this.prisma.resident.findUnique({ where: { cpf } });

    if (user && (await bcrypt.compare(pass, user.password))) {
      // Retorna o usuário sem a senha
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // Gerar o Token de Acesso
  async login(user: any) {
    const payload = { 
      sub: user.id, 
      cpf: user.cpf, // Payload agora usa CPF
      role: user.role, 
      name: user.name 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        name: user.name,
        cpf: user.cpf,
        role: user.role,
        apartment: user.apartment,
        isFirstLogin: user.isFirstLogin // <--- IMPORTANTE: Envia essa flag pro Front
      }
    };
  }

  // Método auxiliar para criar senha criptografada (Hash)
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }
}