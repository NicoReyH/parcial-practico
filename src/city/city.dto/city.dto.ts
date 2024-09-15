import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { SupermarketEntity } from '../../supermarket/supermarket.entity/supermarket.entity';

export class CityDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly country: string;

  @IsInt()
  @IsNotEmpty()
  readonly population: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SupermarketEntity)
  readonly supermarkets: SupermarketEntity[];
}
