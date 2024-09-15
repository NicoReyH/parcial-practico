import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CityService } from './city.service';
import { CityEntity } from './city.entity/city.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CityEntity])],
  providers: [CityService],
})
export class CityModule {}
