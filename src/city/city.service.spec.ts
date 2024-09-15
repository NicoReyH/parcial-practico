import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { CityService } from './city.service';
import { CityEntity } from '../city/city.entity/city.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { seedDatabase } from '../shared/testing-utils/seed-db';

describe('CityService', () => {
  let service: CityService;
  let repository: Repository<CityEntity>;
  let cities;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CityService],
    }).compile();

    service = module.get<CityService>(CityService);
    repository = module.get<Repository<CityEntity>>(
      getRepositoryToken(CityEntity),
    );
    cities = await seedDatabase(repository, null);
  });

  it('findAll should return all cities', async () => {
    const result = await service.findAll();
    expect(result).not.toBeNull();
    expect(result).toHaveLength(5);
  });

  it('findOne should return a city by id', async () => {
    const city = cities[0];
    const result = await service.findOne(city.id);
    expect(result).not.toBeNull();
    expect(result.name).toEqual(city.name);
  });

  it('findOne should throw an exception for an invalid city', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'City with ID 0 not found',
    );
  });

  it('create should return a new city', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'Argentina',
      population: faker.number.int({ min: 1000, max: 1000000 }),
      supermarkets: [],
    };

    const newCity = await service.create(city);
    expect(newCity).not.toBeNull();

    const storedCity = await repository.findOne({ where: { id: newCity.id } });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(newCity.name);
    expect(storedCity.country).toEqual(newCity.country);
    expect(storedCity.population).toEqual(newCity.population);
  });

  it('create should throw an exception for an invalid country', async () => {
    const city: CityEntity = {
      id: '',
      name: faker.location.city(),
      country: 'InvalidCountry',
      population: faker.number.int({ min: 1000, max: 1000000 }),
      supermarkets: [],
    };

    await expect(() => service.create(city)).rejects.toHaveProperty(
      'message',
      'Country InvalidCountry is not valid. Valid countries are: Argentina, Ecuador, Paraguay',
    );
  });

  it('update should modify a city', async () => {
    const city = cities[0];
    city.name = faker.location.city();
    city.country = 'Ecuador';

    const updatedCity = await service.update(city.id, city);
    expect(updatedCity).not.toBeNull();

    const storedCity = await repository.findOne({ where: { id: city.id } });
    expect(storedCity).not.toBeNull();
    expect(storedCity.name).toEqual(city.name);
    expect(storedCity.country).toEqual(city.country);
  });

  it('update should throw an exception for an invalid country', async () => {
    const city = cities[0];
    city.country = 'InvalidCountry';

    await expect(() => service.update(city.id, city)).rejects.toHaveProperty(
      'message',
      'Country InvalidCountry is not valid. Valid countries are: Argentina, Ecuador, Paraguay',
    );
  });

  it('update should throw an exception for an invalid city', async () => {
    let city: CityEntity = cities[0];
    city = { ...city, name: faker.location.city() };

    await expect(() => service.update('0', city)).rejects.toHaveProperty(
      'message',
      'City with ID 0 not found',
    );
  });

  it('delete should remove a city', async () => {
    const city = cities[0];
    await service.delete(city.id);

    const deletedCity = await repository.findOne({ where: { id: city.id } });
    expect(deletedCity).toBeNull();
  });

  it('delete should throw an exception for an invalid city', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'City with ID 0 not found',
    );
  });
});
