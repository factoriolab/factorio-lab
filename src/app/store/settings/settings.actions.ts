import { Action } from '@ngrx/store';

import { DisplayRate, ItemId, RecipeId } from '~/models';
import { SettingsState } from './settings.reducer';

export const enum SettingsActionType {
  LOAD = '[Settings Router] Load',
  SET_DISPLAY_RATE = '[Settings Page] Set Display Rate',
  SET_ITEM_PRECISION = '[Settings Page] Set Item Precision',
  SET_BELT_PRECISION = '[Settings Page] Set Belt Precision',
  SET_FACTORY_PRECISION = '[Settings Page] Set Factory Precision',
  SET_BELT = '[Settings Page] Set Belt',
  SET_ASSEMBLER = '[Settings Page] Set Assembler',
  SET_FURNACE = '[Settings Page] Set Furnace',
  SET_PROD_MODULE = '[Settings Page] Set Prod Module',
  SET_OTHER_MODULE = '[Settings Page] Set Other Module',
  SET_OIL_RECIPE = '[Settings Page] Set Oil Recipe',
}

export class LoadAction implements Action {
  readonly type = SettingsActionType.LOAD;
  constructor(public payload: SettingsState) {}
}

export class SetDisplayRateAction implements Action {
  readonly type = SettingsActionType.SET_DISPLAY_RATE;
  constructor(public payload: DisplayRate) {}
}

export class SetItemPrecisionAction implements Action {
  readonly type = SettingsActionType.SET_ITEM_PRECISION;
  constructor(public payload: number) {}
}

export class SetBeltPrecisionAction implements Action {
  readonly type = SettingsActionType.SET_BELT_PRECISION;
  constructor(public payload: number) {}
}

export class SetFactoryPrecisionAction implements Action {
  readonly type = SettingsActionType.SET_FACTORY_PRECISION;
  constructor(public payload: number) {}
}

export class SetBeltAction implements Action {
  readonly type = SettingsActionType.SET_BELT;
  constructor(public payload: ItemId) {}
}

export class SetAssemblerAction implements Action {
  readonly type = SettingsActionType.SET_ASSEMBLER;
  constructor(public payload: ItemId) {}
}

export class SetFurnaceAction implements Action {
  readonly type = SettingsActionType.SET_FURNACE;
  constructor(public payload: ItemId) {}
}

export class SetProdModule implements Action {
  readonly type = SettingsActionType.SET_PROD_MODULE;
  constructor(public payload: ItemId) {}
}

export class SetOtherModule implements Action {
  readonly type = SettingsActionType.SET_OTHER_MODULE;
  constructor(public payload: ItemId) {}
}

export class SetOilProcessingRecipeAction implements Action {
  readonly type = SettingsActionType.SET_OIL_RECIPE;
  constructor(public payload: RecipeId) {}
}

export type SettingsAction =
  | LoadAction
  | SetDisplayRateAction
  | SetItemPrecisionAction
  | SetBeltPrecisionAction
  | SetFactoryPrecisionAction
  | SetBeltAction
  | SetAssemblerAction
  | SetFurnaceAction
  | SetProdModule
  | SetOtherModule
  | SetOilProcessingRecipeAction;
