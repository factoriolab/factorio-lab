import { IdName } from '../id-name';

export enum Preset {
  Minimum,
  Modules,
  Beacon8,
  Beacon12,
}

export const PresetOptions: IdName[] = [
  { id: Preset.Minimum, name: 'Minimum' },
  { id: Preset.Modules, name: 'Modules' },
  { id: Preset.Beacon8, name: '8 Beacons' },
  { id: Preset.Beacon12, name: '12 Beacons' },
];
