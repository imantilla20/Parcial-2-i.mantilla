import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';

export enum charger_type {
  STANDARD = 'standard',
  FAST = 'fast',
  ULTRA_FAST = 'ultra_fast',
}

@Entity('parking_spots')
export class ParkingSpot {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  code: string;

  @Column({
    type: 'enum',
    enum: charger_type,
    default: charger_type.STANDARD, // Opcional: valor por defecto
  })

  @ManyToOne(() => User, (user) => user.parking_spots)
  @JoinColumn({ name: 'id_supervisor' })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.parking_spot)
  reservations: Reservation[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

}