import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CityEntity } from '../city/city.entity/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CitySupermarketService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,

    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  async addSupermarketToCity(
    cityId: string,
    supermarketId: string,
  ): Promise<CityEntity> {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id: supermarketId },
    });
    if (!supermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${supermarketId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${cityId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    city.supermarkets = [...city.supermarkets, supermarket];
    return await this.cityRepository.save(city);
  }

  async findSupermarketsFromCity(cityId: string): Promise<SupermarketEntity[]> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${cityId} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return city.supermarkets;
  }

  async findSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<SupermarketEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${cityId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    const supermarket = city.supermarkets.find(
      (supermarket) => supermarket.id === supermarketId,
    );
    if (!supermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${supermarketId} not found in City with ID ${cityId}`,
        BusinessError.NOT_FOUND,
      );
    }

    return supermarket;
  }

  async updateSupermarketsFromCity(
    cityId: string,
    supermarketIds: string[],
  ): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${cityId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    const supermarkets = await this.supermarketRepository.findBy({
      id: In(supermarketIds),
    });
    if (supermarkets.length !== supermarketIds.length) {
      throw new BusinessLogicException(
        'One or more supermarkets not found',
        BusinessError.NOT_FOUND,
      );
    }

    city.supermarkets = supermarkets;
    return await this.cityRepository.save(city);
  }

  async deleteSupermarketFromCity(
    cityId: string,
    supermarketId: string,
  ): Promise<void> {
    const city = await this.cityRepository.findOne({
      where: { id: cityId },
      relations: ['supermarkets'],
    });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${cityId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    const supermarket = await this.supermarketRepository.findOne({
      where: { id: supermarketId },
    });
    if (!supermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${supermarketId} not found`,
        BusinessError.NOT_FOUND,
      );
    }

    city.supermarkets = city.supermarkets.filter(
      (supermarket) => supermarket.id !== supermarketId,
    );
    await this.cityRepository.save(city);
  }
}
