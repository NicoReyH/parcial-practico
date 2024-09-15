import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CityEntity } from '../../city/city.entity/city.entity';

export class SupermarketDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber()
  @IsNotEmpty()
  readonly longitude: number;

  @IsNumber()
  @IsNotEmpty()
  readonly latitude: number;

  @IsString()
  @IsNotEmpty()
  readonly website: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CityEntity)
  readonly cities: CityEntity[];
}
