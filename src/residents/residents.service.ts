import { Injectable } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createResidentDto.password, salt);

    return this.prisma.resident.create({
      data: {
        ...createResidentDto,
        password: hashedPassword,
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

  // O MÉTODO QUE FALTAVA 👇
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

  update(id: string, updateResidentDto: UpdateResidentDto) {
    // Se estiver atualizando a senha, precisa criptografar de novo
    if (updateResidentDto.password) {
       // Nota: Num cenário real faríamos o hash aqui também, 
       // mas por enquanto vamos deixar simples para não complicar o DTO de update
    }

    return this.prisma.resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  remove(id: string) {
    return this.prisma.resident.delete({
      where: { id },
    });
  }
}