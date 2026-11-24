import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { ParkingSpot } from '../../parking_spots/entities/parking_spot.entity.js';

export enum vehicle_max_charge {
  STANDARD = 'standard',
  FAST = 'fast',
  ULTRA_FAST = 'ultra_fast',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @ManyToOne(() => ParkingSpot, (parkingSpot) => parkingSpot.reservations)
  @JoinColumn({ name: 'id_spot' })
  parking_spot: ParkingSpot;

  @CreateDateColumn({ type: 'date' })
  date: Date;

  @Column({ type: 'varchar', length: 150 })
  vehicle_plate: string;

@Column({
    type: 'enum',
    enum: vehicle_max_charge,
    default: vehicle_max_charge.STANDARD, // Opcional: valor por defecto
  })

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}