import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpot } from './entities/parking_spot.entity.js';
import {ReservationController} from './entities/reservation.controller.js';
import {ReservationService} from './entities/reservation.service.js';
import {ReservationPolicy} from './entities/reservation.policy.js';
import { Reservation } from '../reservations/entities/reservation.entity.js';
import { User } from '../entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpot,Reservation, User])],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationPolicy],   
  exports: [ReservationService],                 
})
export class ReservationsModule {}