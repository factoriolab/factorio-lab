import Fraction from 'fraction.js';

import * as data from 'src/assets/0-18.json';
import {
  Item,
  Product,
  RateType,
  Step,
  Dataset,
  RecipeSettings
} from '~/models';

let raw = data;
raw = (data as any).default;

export const Data: Dataset = raw;
export const Categories = raw.categories;
export const CategoryId = raw.categories[0].id;
export const CategoryItemRows = {
  [CategoryId]: [
    [raw.items[0].id, raw.items[1].id, raw.items[2].id],
    [raw.items[4].id, raw.items[5].id, raw.items[6].id]
  ]
};
export const ItemEntities = raw.items.reduce((e: { [id: string]: Item }, i) => {
  return { ...e, ...{ [i.id]: i } };
}, {});
export const Item1 = raw.items[0];
export const Item2 = raw.items[1];
export const Product1: Product = {
  id: 0,
  itemId: Item1.id,
  rate: new Fraction(1),
  rateType: RateType.Items
};
export const Product2: Product = {
  id: 1,
  itemId: Item2.id,
  rate: new Fraction(2),
  rateType: RateType.Lanes
};
export const Products = [Product1, Product2];
export const Settings: RecipeSettings = {
  ignore: false,
  belt: 'transport-belt',
  factory: 'assembling-machine-2',
  modules: ['module', 'module'],
  beaconType: 'module',
  beaconCount: 0
};
export const Step1: Step = {
  itemId: Item1.id,
  items: Product1.rate,
  lanes: new Fraction(0.5),
  factories: new Fraction(1),
  settings: Settings
};
export const Step2: Step = {
  itemId: Item2.id,
  items: Product2.rate,
  lanes: new Fraction(1),
  factories: new Fraction(2),
  settings: Settings
};
export const Steps = [Step1, Step2];
