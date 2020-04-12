import { Belt } from './belt';
import { CategoryId } from './category';
import { Factory } from './factory';
import { Module } from './module';

export enum ItemId {
  AssemblingMachine3 = 'assembling-machine-3',
  Coal = 'coal',
  ElectricFurnace = 'electric-furnace',
  ElectricMiningDrill = 'electric-mining-drill',
  ExpressTransportBelt = 'express-transport-belt',
  HeavyOil = 'heavy-oil',
  LightOil = 'light-oil',
  PetroleumGas = 'petroleum-gas',
  Pipe = 'pipe',
  ProductivityModule3 = 'productivity-module-3',
  SolidFuel = 'solid-fuel',
  SpeedModule3 = 'speed-module-3',
  Water = 'water',
  WoodenChest = 'wooden-chest',
}

export interface Item {
  id: ItemId;
  name: string;
  category: CategoryId;
  row: number;
  stack?: number;
  belt?: Belt;
  factory?: Factory;
  module?: Module;
}
