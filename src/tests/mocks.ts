import { data } from 'src/data';
import {
  Product,
  RateType,
  Step,
  RecipeSettings,
  Entities,
  Node,
  Rational,
  RationalProduct,
  ItemSettings,
} from '~/models';
import {
  DatasetsState,
  datasetsReducer,
  LoadDataAction,
} from '~/store/datasets';
import { getProductsBy } from '~/store/products';
import {
  getRecipeSettings,
  getAdjustedDataset,
  getRationalRecipeSettings,
} from '~/store/recipes';
import {
  settingsReducer,
  getNormalDataset,
  SetBaseAction,
} from '~/store/settings';
import { getItemSettings } from '~/store/items';
import { ItemId } from './item-id';

export const Raw = data;
export const DataState: DatasetsState = datasetsReducer(
  undefined,
  new LoadDataAction(data)
);
export const Data = getNormalDataset.projector(data[0], [data[1]]);
export const Defaults = data[0].defaults;
export const CategoryId = Data.categoryIds[0];
export const Item1 = Data.itemEntities[Data.itemIds[0]];
export const Item2 = Data.itemEntities[Data.itemIds[1]];
export const Recipe1 = Data.recipeEntities[Data.recipeIds[0]];
export const Product1: Product = {
  id: '0',
  itemId: Item1.id,
  rate: 1,
  rateType: RateType.Items,
};
export const Product2: Product = {
  id: '1',
  itemId: Item2.id,
  rate: 2,
  rateType: RateType.Belts,
};
export const Product3: Product = {
  id: '2',
  itemId: ItemId.PetroleumGas,
  rate: 3,
  rateType: RateType.Wagons,
};
export const Product4: Product = {
  id: '3',
  itemId: ItemId.TransportBelt,
  rate: 4,
  rateType: RateType.Factories,
};
export const Products = [Product1, Product2, Product3, Product4];
export const RationalProducts = Products.map((p) => new RationalProduct(p));
export const ProductIds = Products.map((p) => p.id);
export const ProductEntities = getProductsBy.projector(RationalProducts);
export const ItemSettings1: ItemSettings = {
  ignore: false,
  belt: ItemId.TransportBelt,
};
export const RecipeSettings1: RecipeSettings = {
  factory: ItemId.AssemblingMachine2,
  modules: [ItemId.Module, ItemId.Module],
  beaconModule: ItemId.SpeedModule,
  beaconCount: 0,
};
export const RecipeSettings2: RecipeSettings = {
  factory: ItemId.AssemblingMachine2,
  modules: [ItemId.Module, ItemId.Module],
  beaconModule: ItemId.Module,
  beaconCount: 0,
};
export const Step1: Step = {
  itemId: Item1.id,
  recipeId: Item1.id as any,
  items: Rational.fromNumber(Product1.rate),
  belts: Rational.fromNumber(0.5),
  factories: Rational.one,
};
export const Step2: Step = {
  itemId: Item2.id,
  recipeId: Item2.id as any,
  items: Rational.fromNumber(Product2.rate),
  belts: Rational.one,
  factories: Rational.two,
};
export const Steps = [Step1, Step2];
export const Node1: Node = { ...Step1, ...{ id: 'id1', name: 'name1' } };
export const Node2: Node = {
  ...Step1,
  ...{ id: 'id2', name: Array(1000).join('X'), children: [Node1] },
};
export const Node3 = { ...Step1, ...{ id: 'id3', name: 'name3' } };
export const Root: Node = { id: 'root', children: [Node2, Node3] } as any;
export const BeltSpeed: Entities<Rational> = {
  [ItemId.TransportBelt]: new Rational(BigInt(15)),
};
export const ItemSettingsEntities: Entities<ItemSettings> = {};
for (const item of Data.itemIds.map((i) => Data.itemEntities[i])) {
  ItemSettingsEntities[item.id] = { ...ItemSettings1 };
}
export const RecipeSettingsEntities: Entities<RecipeSettings> = {};
for (const recipe of Data.recipeIds.map((i) => Data.recipeEntities[i])) {
  RecipeSettingsEntities[recipe.id] = { ...RecipeSettings1 };
}
export const InitialSettingsState = settingsReducer(
  undefined,
  new SetBaseAction(data[0])
);
export const ItemSettingsInitial = getItemSettings.projector(
  {},
  Data,
  ItemId.TransportBelt
);
export const RecipeSettingsInitial = getRecipeSettings.projector(
  {},
  InitialSettingsState.factoryRank,
  InitialSettingsState.moduleRank,
  InitialSettingsState.beaconModule,
  InitialSettingsState.beaconCount,
  InitialSettingsState.drillModule,
  Data
);
export const RationalRecipeSettings = getRationalRecipeSettings.projector(
  RecipeSettingsEntities
);
export const AdjustedData = getAdjustedDataset.projector(
  RationalRecipeSettings,
  Rational.zero,
  Rational.zero,
  ItemId.Coal,
  Data
);
