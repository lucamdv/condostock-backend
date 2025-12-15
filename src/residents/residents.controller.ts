import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ResidentsService } from './residents.service';
import { CreateResidentDto } from './dto/create-resident.dto';
import { UpdateResidentDto } from './dto/update-resident.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('residents')
@Controller('residents')
export class ResidentsController {
  constructor(private readonly residentsService: ResidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo morador e abrir conta' })
  create(@Body() createResidentDto: CreateResidentDto) {
    return this.residentsService.create(createResidentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar moradores e situação da conta' })
  findAll() {
    return this.residentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.residentsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateResidentDto: UpdateResidentDto,
  ) {
    return this.residentsService.update(id, updateResidentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.residentsService.remove(id);
  }
  @Get(':id/history')
  @ApiOperation({
    summary: 'Ver extrato de compras do morador (Fatura Detalhada)',
  })
  getHistory(@Param('id') id: string) {
    return this.residentsService.getHistory(id);
  }
}
