import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SupermarketEntity } from './supermarket.entity/supermarket.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermarketService {
  constructor(
    @InjectRepository(SupermarketEntity)
    private readonly supermarketRepository: Repository<SupermarketEntity>,
  ) {}

  private validateName(name: string): void {
    if (name.length <= 10) {
      throw new BusinessLogicException(
        `The name of the supermarket must be more than 10 characters.`,
        BusinessError.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<SupermarketEntity[]> {
    return await this.supermarketRepository.find();
  }

  async findOne(id: string): Promise<SupermarketEntity> {
    const supermarket = await this.supermarketRepository.findOne({
      where: { id },
    });
    if (!supermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    return supermarket;
  }

  async create(supermarketData: SupermarketEntity): Promise<SupermarketEntity> {
    this.validateName(supermarketData.name);

    const supermarket = this.supermarketRepository.create(supermarketData);
    return await this.supermarketRepository.save(supermarket);
  }

  async update(
    id: string,
    updateData: SupermarketEntity,
  ): Promise<SupermarketEntity> {
    const persistedSupermarket = await this.findOne(id);
    if (!persistedSupermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    if (updateData.name) {
      this.validateName(updateData.name);
    }

    return await this.supermarketRepository.save({
      ...persistedSupermarket,
      ...updateData,
    });
  }

  async delete(id: string): Promise<void> {
    const supermarket = await this.findOne(id);
    if (!supermarket) {
      throw new BusinessLogicException(
        `Supermarket with ID ${id} not found`,
        BusinessError.NOT_FOUND,
      );
    }
    await this.supermarketRepository.remove(supermarket);
  }
}
