import { Repository } from 'typeorm';
import { CityEntity } from '../../city/city.entity/city.entity';
import { SupermarketEntity } from '../../supermarket/supermarket.entity/supermarket.entity';
import { faker } from '@faker-js/faker';

export const seedDatabase = async (
  cityRepository: Repository<CityEntity>,
  supermarketRepository: Repository<SupermarketEntity>,
) => {
  if (!cityRepository || !supermarketRepository) {
    throw new Error('CityRepository or SupermarketRepository is null');
  }

  await cityRepository.clear();
  await supermarketRepository.clear();

  const cities: CityEntity[] = [];
  for (let i = 0; i < 5; i++) {
    const city = new CityEntity();
    city.name = faker.location.city();
    city.supermarkets = [];

    for (let j = 0; j < 3; j++) {
      const supermarket = new SupermarketEntity();
      supermarket.name = faker.company.name() + ' Supermarket';
      supermarket.longitude = faker.location.longitude();
      supermarket.latitude = faker.location.latitude();
      supermarket.website = faker.internet.url();
      city.supermarkets.push(supermarket);
    }

    cities.push(await cityRepository.save(city));
  }
};
