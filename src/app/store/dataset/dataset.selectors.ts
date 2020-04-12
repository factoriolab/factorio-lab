import { createSelector } from '@ngrx/store';
import Fraction from 'fraction.js';

import { Entities, ItemId, RecipeId } from '~/models';
import * as Settings from '../settings';
import { State } from '../';

/* Base selector functions */
export const getDataset = (state: State) => state.datasetState;

/* Complex selectors */
export const getCategoryItemRows = createSelector(getDataset, (data) => {
  const map: Entities<string[][]> = {};

  for (const id of data.categoryIds) {
    const rows: string[][] = [[]];
    const items = data.items
      .filter((p) => p.category === id)
      .sort((a, b) => a.row - b.row);
    if (items.length) {
      let index = items[0].row;
      for (const item of items) {
        if (item.row > index) {
          rows.push([]);
          index = item.row;
        }
        rows[rows.length - 1].push(item.id);
      }
    }
    map[id] = rows;
  }

  return map;
});

export const getLaneIds = createSelector(getDataset, (data) =>
  data.itemIds.filter(
    (i) => data.itemEntities[i].belt || data.itemEntities[i].id === ItemId.Pipe
  )
);

export const getLaneSpeed = createSelector(
  getDataset,
  getLaneIds,
  Settings.getFlowRate,
  (data, laneIds, flowRate) => {
    const value: Entities<Fraction> = {};
    for (const id of laneIds) {
      if (id === ItemId.Pipe) {
        value[id] = new Fraction(flowRate);
      } else {
        value[id] = new Fraction(data.itemEntities[id].belt.speed);
      }
    }
    return value;
  }
);

export const getOilRecipes = createSelector(
  getDataset,
  Settings.getOilRecipe,
  (data, oilRecipeId) => {
    return {
      heavy: data.recipeEntities[oilRecipeId],
      light: data.recipeEntities[RecipeId.HeavyOilCracking],
      petrol: data.recipeEntities[RecipeId.LightOilCracking],
      fuelLight: data.recipeEntities[RecipeId.SolidFuelFromLightOil],
      fuelPetrol: data.recipeEntities[RecipeId.SolidFuelFromPetroleumGas],
    };
  }
);
