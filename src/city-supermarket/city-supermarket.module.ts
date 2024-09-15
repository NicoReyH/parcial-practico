import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitySupermarketService } from './city-supermarket.service';
import { CityEntity } from '../city/city.entity/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import { CitySupermarketController } from './city-supermarket.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity, SupermarketEntity])],
  providers: [CitySupermarketService],
  controllers: [CitySupermarketController],
})
export class CitySupermarketModule {}
