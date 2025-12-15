import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ResidentsService {
  constructor(private prisma: PrismaService) {}

  async create(createResidentDto: CreateResidentDto) {
    try {
      // Transação: Cria o Morador E a Conta dele ao mesmo tempo
      return await this.prisma.$transaction(async (tx) => {
        // 1. Cria o registro do morador
        const resident = await tx.resident.create({
          data: createResidentDto,
        });

        // 2. Cria a conta corrente (Carteira) vinculada
        await tx.residentAccount.create({
          data: {
            residentId: resident.id,
            creditLimit: 200.00, // Limite padrão inicial
            balance: 0.00,       // Começa devendo nada
            status: 'ACTIVE',
          },
        });

        return resident;
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Já existe um morador com este CPF.');
      }
      throw error;
    }
  }

  // Busca todos os moradores e inclui quanto eles devem (balance)
  async findAll() {
    return this.prisma.resident.findMany({
      include: {
        account: true, // Traz a conta junto para vermos o saldo/limite
      },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const resident = await this.prisma.resident.findUnique({
      where: { id },
      include: { account: true },
    });

    if (!resident) throw new NotFoundException('Morador não encontrado.');
    return resident;
  }

  // Atualizar dados cadastrais
  async update(id: string, updateResidentDto: UpdateResidentDto) {
    await this.findOne(id); // Garante que existe
    return this.prisma.resident.update({
      where: { id },
      data: updateResidentDto,
    });
  }

  // Remove morador e conta (Cuidado: só deveria permitir se saldo for 0)
  async remove(id: string) {
    const resident = await this.findOne(id);
    
    // Regra de segurança: Não apagar quem deve!
    if (Number(resident.account?.balance) > 0) {
      throw new ConflictException('Não é possível remover morador com débito pendente.');
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.residentAccount.delete({ where: { residentId: id } });
      await tx.resident.delete({ where: { id } });
      return { message: 'Morador removido com sucesso.' };
    });
  }
  // ... métodos anteriores (create, findAll, findOne, update, remove)

  async getHistory(id: string) {
    // Garante que o morador existe
    await this.findOne(id);

    // Busca todas as vendas vinculadas a este morador
    return this.prisma.sale.findMany({
      where: { residentId: id },
      include: {
        items: {
          include: {
            product: {
              select: { name: true, price: true } // Traz só o nome e preço pra ficar limpo
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' } // Mais recentes primeiro
    });
  }
}