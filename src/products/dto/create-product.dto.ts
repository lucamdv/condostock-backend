import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsOptional()
  barcode?: string;

  @IsNumber()
  price: number;

  @IsNumber()
  @IsOptional()
  minStock?: number;
}