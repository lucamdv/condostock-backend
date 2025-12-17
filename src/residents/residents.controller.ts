import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('residents')
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo morador' })
  create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentsService.create(createResidentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os moradores' })
  findAll() {
    return this.residentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar morador por ID' })
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  // --- ROTA NOVA QUE FALTAVA 👇 ---
  @Get(':id/history')
  @ApiOperation({ summary: 'Histórico de compras' })
  getHistory(@Param('id') id: string) {
    return this.residentsService.getHistory(id);
  }

  // --- ROTA DE TROCA DE SENHA (ESSENCIAL) 👇 ---
  @Post(':id/change-password')
  @ApiOperation({ summary: 'Troca de senha obrigatória' })
  changePassword(@Param('id') id: string, @Body() body: { password: string }) {
    // O body chega como { password: '...' }
    return this.residentsService.changePassword(id, body.password);
  }
  // ----------------------------------------------

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar dados do morador' })
  update(@Param('id') id: string, @Body() updateResidentDto: UpdateResidentDto) {
    return this.residentsService.update(id, updateResidentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover morador' })
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
}