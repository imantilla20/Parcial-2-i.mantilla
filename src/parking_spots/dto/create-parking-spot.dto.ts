import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateParkingSpotDto {
  @IsString({ message: 'code es requerido' })
  @IsNotEmpty({ message: 'code es requerido' })
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}