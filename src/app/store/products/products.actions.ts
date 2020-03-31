import { Action } from '@ngrx/store';
import Fraction from 'fraction.js';

import { RateType, Product } from 'src/app/models';

export enum ProductsActionType {
  ADD = '[Products Page] Add',
  REMOVE = '[Products Page] Remove',
  OPEN_EDIT_PRODUCT = '[Products Page] Open Edit Product',
  CANCEL_EDIT_PRODUCT = '[Products Page] Cancel Edit Product',
  COMMIT_EDIT_PRODUCT = '[Products Page] Commit Edit Product',
  EDIT_RATE = '[Products Page] Edit Rate',
  EDIT_RATE_TYPE = '[Products Page] Edit Rate Type',
  SELECT_ITEM_CATEGORY = '[Products Page] Select Item Category',
  EFFECT_SELECT_ITEM_CATEGORY = '[Products Effect] Select Item Category'
}

export class AddAction implements Action {
  readonly type = ProductsActionType.ADD;
}

export class RemoveAction implements Action {
  readonly type = ProductsActionType.REMOVE;
  constructor(public payload: number) {}
}

export class OpenEditProductAction implements Action {
  readonly type = ProductsActionType.OPEN_EDIT_PRODUCT;
  constructor(public payload: Product) {}
}

export class CancelEditProductAction implements Action {
  readonly type = ProductsActionType.CANCEL_EDIT_PRODUCT;
}

export class CommitEditProductAction implements Action {
  readonly type = ProductsActionType.COMMIT_EDIT_PRODUCT;
  constructor(public payload: [number, string]) {}
}

export class EditRateAction implements Action {
  readonly type = ProductsActionType.EDIT_RATE;
  constructor(public payload: [number, Fraction]) {}
}

export class EditRateTypeAction implements Action {
  readonly type = ProductsActionType.EDIT_RATE_TYPE;
  constructor(public payload: [number, RateType]) {}
}

export class SelectItemCategoryAction implements Action {
  readonly type = ProductsActionType.SELECT_ITEM_CATEGORY;
  constructor(public payload: string) {}
}

export class EffectSelectItemCategoryAction implements Action {
  readonly type = ProductsActionType.EFFECT_SELECT_ITEM_CATEGORY;
  constructor(public payload: string) {}
}

export type ProductsAction =
  | AddAction
  | RemoveAction
  | OpenEditProductAction
  | CancelEditProductAction
  | CommitEditProductAction
  | EditRateAction
  | EditRateTypeAction
  | SelectItemCategoryAction
  | EffectSelectItemCategoryAction;
