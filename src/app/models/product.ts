import { RateType } from './enum/rate-type';
import { Rational } from './rational';

export enum ProductField {
  Id = 'id',
  ItemId = 'itemId',
  Rate = 'rate',
  RateType = 'rateType',
  RecipeId = 'recipeId',
}

export interface Product {
  id: string;
  itemId: string;
  rate: number;
  rateType: RateType;
  recipeId?: string;
}

export class RationalProduct {
  id: string;
  itemId: string;
  rate: Rational;
  rateType: RateType;
  recipeId?: string;

  constructor(data: Product) {
    this.id = data.id;
    this.itemId = data.itemId;
    this.rate = Rational.fromNumber(data.rate);
    this.rateType = data.rateType;
    if (data.recipeId) {
      this.recipeId = data.recipeId;
    }
  }
}
