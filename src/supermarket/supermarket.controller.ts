import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { SupermarketService } from './supermarket.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { SupermarketDto } from './supermarket.dto/supermarket.dto';
import { SupermarketEntity } from './supermarket.entity/supermarket.entity';

@Controller('supermarket')
@UseInterceptors(BusinessErrorsInterceptor)
export class SupermarketController {
  constructor(private readonly supermarketService: SupermarketService) {}

  @Get()
  async findAll() {
    return await this.supermarketService.findAll();
  }

  @Get(':supermarketId')
  async findOne(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.findOne(supermarketId);
  }

  @Post()
  async create(@Body() supermarketDto: SupermarketDto) {
    const supermarket: SupermarketEntity = plainToInstance(
      SupermarketEntity,
      supermarketDto,
    );
    return await this.supermarketService.create(supermarket);
  }

  @Put(':supermarketId')
  async update(
    @Param('supermarketId') supermarketId: string,
    @Body() supermarketDto: SupermarketDto,
  ) {
    const supermarket: SupermarketEntity = plainToInstance(
      SupermarketEntity,
      supermarketDto,
    );
    return await this.supermarketService.update(supermarketId, supermarket);
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async delete(@Param('supermarketId') supermarketId: string) {
    return await this.supermarketService.delete(supermarketId);
  }
}
