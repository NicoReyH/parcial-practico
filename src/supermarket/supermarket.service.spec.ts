import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { SupermarketService } from './supermarket.service';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('SupermarketService', () => {
  let service: SupermarketService;
  let repository: Repository<SupermarketEntity>;
  let supermarkets;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermarketService],
    }).compile();

    service = module.get<SupermarketService>(SupermarketService);
    repository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );
  });

  it('findAll should return all supermarkets', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(15); // 5 cities * 3 supermarkets each
  });

  it('findOne should return a supermarket by id', async () => {
    const supermarket = supermarkets[0];
    const result = await service.findOne(supermarket.id);
    expect(result).not.toBeNull();
    expect(result.name).toEqual(supermarket.name);
  });

  it('findOne should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'Supermarket with ID 0 not found',
    );
  });

  it('create should return a new supermarket', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      name: faker.company.name() + ' Supermarket',
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
      cities: [],
    };

    const newSupermarket = await service.create(supermarket);
    expect(newSupermarket).not.toBeNull();

    const storedSupermarket = await repository.findOne({
      where: { id: newSupermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(newSupermarket.name);
    expect(storedSupermarket.longitude).toEqual(newSupermarket.longitude);
    expect(storedSupermarket.latitude).toEqual(newSupermarket.latitude);
    expect(storedSupermarket.website).toEqual(newSupermarket.website);
  });

  it('create should throw an exception for a name with less than 10 characters', async () => {
    const supermarket: SupermarketEntity = {
      id: '',
      name: 'Short',
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
      cities: [],
    };

    await expect(() => service.create(supermarket)).rejects.toHaveProperty(
      'message',
      'The name of the supermarket must be more than 10 characters.',
    );
  });

  it('update should modify a supermarket', async () => {
    const supermarket = supermarkets[0];
    supermarket.name = faker.company.name() + ' Supermarket';

    const updatedSupermarket = await service.update(
      supermarket.id,
      supermarket,
    );
    expect(updatedSupermarket).not.toBeNull();

    const storedSupermarket = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(storedSupermarket).not.toBeNull();
    expect(storedSupermarket.name).toEqual(supermarket.name);
  });

  it('update should throw an exception for a name with less than 10 characters', async () => {
    const supermarket = supermarkets[0];
    supermarket.name = 'Short';

    await expect(() =>
      service.update(supermarket.id, supermarket),
    ).rejects.toHaveProperty(
      'message',
      'The name of the supermarket must be more than 10 characters.',
    );
  });

  it('update should throw an exception for an invalid supermarket', async () => {
    let supermarket: SupermarketEntity = supermarkets[0];
    supermarket = {
      ...supermarket,
      name: faker.company.name() + ' Supermarket',
    };

    await expect(() => service.update('0', supermarket)).rejects.toHaveProperty(
      'message',
      'Supermarket with ID 0 not found',
    );
  });

  it('delete should remove a supermarket', async () => {
    const supermarket = supermarkets[0];
    await service.delete(supermarket.id);

    const deletedSupermarket = await repository.findOne({
      where: { id: supermarket.id },
    });
    expect(deletedSupermarket).toBeNull();
  });

  it('delete should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'Supermarket with ID 0 not found',
    );
  });
});
