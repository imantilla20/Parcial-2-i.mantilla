import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../roles/entities/role.entity.js';
import { ParkingSpot } from '../../parking_spots/entities/parking_spot.entity.js';
import { Reservation } from '../../reservations/entities/reservation.entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;            // guarda el HASH, nunca el texto

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({                 // el lado con @JoinTable es el "dueño" de la tabla intermedia
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: Role[];

  @OneToMany(() => Reservation, (reservation) => reservation.parking_spot)
  reservations: Reservation[];

  @OneToMany(() => ParkingSpot, (parkingSpot) => parkingSpot.user)
  parking_spots: ParkingSpot[];
}