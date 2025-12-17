import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '12345678900' })
  @IsString()
  @IsNotEmpty()
  cpf: string; // <--- Novo Obrigatório

  @ApiProperty({ example: '302' })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  block: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  phone?: string;
  
  @IsString()
  @IsOptional()
  email?: string;

  @IsBoolean()
  @IsOptional()
  isMainTenant?: boolean;
}