import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CityEntity } from './city.entity/city.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(CityEntity)
    private readonly cityRepository: Repository<CityEntity>,
  ) {}

  private readonly validCountries = ['Argentina', 'Ecuador', 'Paraguay'];

  private validateCountry(country: string): void {
    if (!this.validCountries.includes(country)) {
      throw new BusinessLogicException(
        `Country ${country} is not valid. Valid countries are: ${this.validCountries.join(', ')}`,
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<CityEntity[]> {
    return await this.cityRepository.find();
  }

  async findOne(id: string): Promise<CityEntity> {
    const city = await this.cityRepository.findOne({ where: { id } });
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return city;
  }

  async create(cityData: CityEntity): Promise<CityEntity> {
    this.validateCountry(cityData.country);

    const city = this.cityRepository.create(cityData);
    return await this.cityRepository.save(city);
  }

  async update(id: string, updateCity: CityEntity): Promise<CityEntity> {
    const persistedCity = await this.findOne(id);
    if (!persistedCity) {
      throw new BusinessLogicException(
        `City with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    if (updateCity.country) {
      this.validateCountry(updateCity.country);
    }

    return await this.cityRepository.save({ ...persistedCity, ...updateCity });
  }

  async delete(id: string): Promise<void> {
    const city = await this.findOne(id);
    if (!city) {
      throw new BusinessLogicException(
        `City with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    await this.cityRepository.remove(city);
  }
}
