import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateResidentDto {
  @ApiProperty({ example: 'João da Silva', description: 'Nome completo do morador' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Bloco A - Apt 302', description: 'Identificação da unidade' })
  @IsString()
  @IsNotEmpty()
  unit: string;

  @ApiPropertyOptional({ example: '123.456.789-00', description: 'CPF para Nota Fiscal (opcional)' })
  @IsString()
  @IsOptional()
  cpf?: string;

  @ApiPropertyOptional({ example: '(11) 99999-9999', description: 'Telefone para contato' })
  @IsString()
  @IsOptional()
  phone?: string;
}