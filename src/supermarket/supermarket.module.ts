import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermarketEntity } from './supermarket.entity/supermarket.entity';
import { SupermarketService } from './supermarket.service';

@Module({
  imports: [TypeOrmModule.forFeature([SupermarketEntity])],
  providers: [SupermarketService],
})
export class SupermarketModule {}
