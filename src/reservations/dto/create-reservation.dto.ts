import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString({ message: 'vehicle_plate es requerido' })
  @IsNotEmpty({ message: 'vehicle_plate es requerido' })
  vehicle_plate: string;

  @IsOptional()
  @IsString()
  description?: string;
}