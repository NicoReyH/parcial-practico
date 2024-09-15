import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseInterceptors,
} from '@nestjs/common';
import { CitySupermarketService } from './city-supermarket.service';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';

@Controller('cities/:cityId/supermarkets')
@UseInterceptors(BusinessErrorsInterceptor)
export class CitySupermarketController {
  constructor(
    private readonly citySupermarketService: CitySupermarketService,
  ) {}

  @Post(':supermarketId')
  async addSupermarketToCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.addSupermarketToCity(
      cityId,
      supermarketId,
    );
  }

  @Get()
  async findSupermarketsFromCity(@Param('cityId') cityId: string) {
    return await this.citySupermarketService.findSupermarketsFromCity(cityId);
  }

  @Get(':supermarketId')
  async findSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.findSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }

  @Put()
  async updateSupermarketsFromCity(
    @Param('cityId') cityId: string,
    @Body() supermarketIds: string[],
  ) {
    return await this.citySupermarketService.updateSupermarketsFromCity(
      cityId,
      supermarketIds,
    );
  }

  @Delete(':supermarketId')
  @HttpCode(204)
  async deleteSupermarketFromCity(
    @Param('cityId') cityId: string,
    @Param('supermarketId') supermarketId: string,
  ) {
    return await this.citySupermarketService.deleteSupermarketFromCity(
      cityId,
      supermarketId,
    );
  }
}
