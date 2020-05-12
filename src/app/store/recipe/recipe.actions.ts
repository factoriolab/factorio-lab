import { Action } from '@ngrx/store';

import { RecipeId, ItemId } from '~/models';
import { RecipeState } from './recipe.reducer';

export const enum RecipeActionType {
  LOAD = '[Recipes Router] Load',
  IGNORE = '[Recipes Page] Ignore Recipe',
  RESET = '[Recipes Page] Reset Recipe',
  EDIT_FACTORY_MODULE = '[Recipes Page] Edit Factory Module',
  EDIT_BEACON_MODULE = '[Recipes Page] Edit Beacon Module',
  EDIT_BEACONS_COUNT = '[Recipes Page] Edit Beacon Count',
}

export class LoadAction implements Action {
  readonly type = RecipeActionType.LOAD;
  constructor(public payload: RecipeState) {}
}

export class IgnoreAction implements Action {
  readonly type = RecipeActionType.IGNORE;
  constructor(public payload: RecipeId) {}
}

export class ResetAction implements Action {
  readonly type = RecipeActionType.RESET;
  constructor(public payload: RecipeId) {}
}

export class EditFactoryModuleAction implements Action {
  readonly type = RecipeActionType.EDIT_FACTORY_MODULE;
  constructor(public payload: [RecipeId, ItemId[]]) {}
}

export class EditBeaconModuleAction implements Action {
  readonly type = RecipeActionType.EDIT_BEACON_MODULE;
  constructor(public payload: [RecipeId, ItemId]) {}
}

export class EditBeaconCountAction implements Action {
  readonly type = RecipeActionType.EDIT_BEACONS_COUNT;
  constructor(public payload: [RecipeId, number]) {}
}

export type RecipeAction =
  | LoadAction
  | IgnoreAction
  | ResetAction
  | EditFactoryModuleAction
  | EditBeaconModuleAction
  | EditBeaconCountAction;
