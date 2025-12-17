import { Injectable } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto) {
    // 1. Gera senha padrão: 4 primeiros dígitos do CPF
    const cleanCpf = createResidentDto.cpf.replace(/\D/g, ''); 
    const defaultPassword = cleanCpf.substring(0, 4); 
    
    // 2. Criptografa
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    // 3. Salva no banco
    return this.prisma.resident.create({
      data: {
        ...createResidentDto,
        password: hashedPassword,
        isFirstLogin: true, // Força a troca
        account: {
          create: {
            balance: 0,
            status: 'ACTIVE'
          }
        }
      },
    });
  }

  findAll() {
    return this.prisma.resident.findMany({
      include: { account: true }
    });
  }

  findOne(id: string) {
    return this.prisma.resident.findUnique({
      where: { id },
      include: { account: true, dependents: true }
    });
  }

  async getHistory(id: string) {
    return this.prisma.sale.findMany({
      where: { residentId: id },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // --- MÉTODO CORRIGIDO ---
  async update(id: string, updateResidentDto: UpdateResidentDto) {
    // Removemos a lógica de 'if (updateResidentDto.password)' daqui.
    // Alterações de senha devem ser feitas exclusivamente pela rota changePassword.
    
    return this.prisma.resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  // Método exclusivo para troca de senha
  async changePassword(id: string, newPass: string) {
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(newPass, salt);
    
    return this.prisma.resident.update({
        where: { id },
        data: { 
            password: hash,
            isFirstLogin: false
        }
    });
  }

  remove(id: string) {
    return this.prisma.resident.delete({
      where: { id },
    });
  }
}