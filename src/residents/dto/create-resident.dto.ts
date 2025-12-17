import { IsEmail, IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResidentDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'joao@condo.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'senha123', description: 'Senha para login' })
  @IsString()
  @IsNotEmpty() // Vamos exigir senha. Se o front não mandar, o service cria uma padrão.
  password: string;

  @ApiProperty({ example: '302' })
  @IsString()
  @IsNotEmpty()
  apartment: string;

  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  block: string;

  @ApiProperty({ example: '99999-9999', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isMainTenant?: boolean;
}