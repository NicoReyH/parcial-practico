import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { CitySupermarketService } from './city-supermarket.service';
import { CityEntity } from '../city/city.entity/city.entity';
import { SupermarketEntity } from '../supermarket/supermarket.entity/supermarket.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { seedDatabase } from '../shared/testing-utils/seed-db';

describe('CitySupermarketService', () => {
  let service: CitySupermarketService;
  let cityRepository: Repository<CityEntity>;
  let supermarketRepository: Repository<SupermarketEntity>;
  let city: CityEntity;
  let supermarkets: SupermarketEntity[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CitySupermarketService],
    }).compile();

    service = module.get<CitySupermarketService>(CitySupermarketService);
    cityRepository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    supermarketRepository = module.get<Repository<SupermarketEntity>>(
      getRepositoryToken(SupermarketEntity),
    );

    await seedDatabase(cityRepository, supermarketRepository);

    city = await cityRepository.findOne({ relations: ['supermarkets'] });
    supermarkets = await supermarketRepository.find();
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const newSupermarket = await supermarketRepository.save({
      name: faker.company.name() + ' Supermarket',
      longitude: faker.location.longitude(),
      latitude: faker.location.latitude(),
      website: faker.internet.url(),
    });

    const updatedCity = await service.addSupermarketToCity(
      city.id,
      newSupermarket.id,
    );
    expect(updatedCity.supermarkets).toContainEqual(newSupermarket);
  });

  it('addSupermarketToCity should throw exception for invalid supermarket', async () => {
    await expect(() =>
      service.addSupermarketToCity(city.id, '0'),
    ).rejects.toHaveProperty('message', 'Supermarket with ID 0 not found');
  });

  it('addSupermarketToCity should throw exception for invalid city', async () => {
    const supermarket = supermarkets[0];
    await expect(() =>
      service.addSupermarketToCity('0', supermarket.id),
    ).rejects.toHaveProperty('message', 'City with ID 0 not found');
  });

  it('findSupermarketsFromCity should return supermarkets by city', async () => {
    const result = await service.findSupermarketsFromCity(city.id);
    expect(result).toHaveLength(city.supermarkets.length);
  });

  it('findSupermarketsFromCity should throw exception for invalid city', async () => {
    await expect(() =>
      service.findSupermarketsFromCity('0'),
    ).rejects.toHaveProperty('message', 'City with ID 0 not found');
  });

  it('findSupermarketFromCity should return supermarket by id in city', async () => {
    const supermarket = supermarkets[0];
    const result = await service.findSupermarketFromCity(
      city.id,
      supermarket.id,
    );
    expect(result).not.toBeNull();
    expect(result.id).toEqual(supermarket.id);
  });

  it('findSupermarketFromCity should throw exception for invalid city', async () => {
    const supermarket = supermarkets[0];
    await expect(() =>
      service.findSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty('message', 'City with ID 0 not found');
  });

  it('findSupermarketFromCity should throw exception for invalid supermarket', async () => {
    await expect(() =>
      service.findSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'Supermarket with ID 0 not found in City with ID ' + city.id,
    );
  });

  it('updateSupermarketsFromCity should update supermarkets list in city', async () => {
    const newSupermarkets = supermarkets.slice(0, 2);
    const updatedCity = await service.updateSupermarketsFromCity(
      city.id,
      newSupermarkets.map((s) => s.id),
    );
    expect(updatedCity.supermarkets).toEqual(
      expect.arrayContaining(newSupermarkets),
    );
  });

  it('updateSupermarketsFromCity should throw exception for invalid city', async () => {
    const newSupermarkets = supermarkets.slice(0, 2);
    await expect(() =>
      service.updateSupermarketsFromCity(
        '0',
        newSupermarkets.map((s) => s.id),
      ),
    ).rejects.toHaveProperty('message', 'City with ID 0 not found');
  });

  it('updateSupermarketsFromCity should throw exception for invalid supermarkets', async () => {
    await expect(() =>
      service.updateSupermarketsFromCity(city.id, ['0']),
    ).rejects.toHaveProperty('message', 'One or more supermarkets not found');
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermarket = city.supermarkets[0];
    await service.deleteSupermarketFromCity(city.id, supermarket.id);

    const updatedCity = await cityRepository.findOne({
      where: { id: city.id },
      relations: ['supermarkets'],
    });
    expect(updatedCity.supermarkets).not.toContainEqual(supermarket);
  });

  it('deleteSupermarketFromCity should throw exception for invalid city', async () => {
    const supermarket = supermarkets[0];
    await expect(() =>
      service.deleteSupermarketFromCity('0', supermarket.id),
    ).rejects.toHaveProperty('message', 'City with ID 0 not found');
  });

  it('deleteSupermarketFromCity should throw exception for invalid supermarket', async () => {
    await expect(() =>
      service.deleteSupermarketFromCity(city.id, '0'),
    ).rejects.toHaveProperty('message', 'Supermarket with ID 0 not found');
  });
});
