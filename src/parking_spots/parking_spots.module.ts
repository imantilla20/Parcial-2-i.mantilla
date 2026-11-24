import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpot } from './entities/parking_spot.entity.js';
import {ParkingSpotController} from './entities/parking_spot.controller.js';
import {ParkingSpotService} from './entities/parking_spot.service.js';
import {ParkingSpotPolicy} from './entities/parking_spot.service.js';
import { Reservation } from '../reservations/entities/reservation.entity.js';
import { User } from '../entities/user.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpot,Reservation, User])],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotService, ParkingSpotPolicy],   
  exports: [ParkingSpotService],                 
})
export class ParkingSpotsModule {}