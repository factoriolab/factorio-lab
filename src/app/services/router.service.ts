import { Injectable } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { take, filter } from 'rxjs/operators';
import * as pako from 'pako';

import { ItemId, Entities, Product, NEntities, RecipeSettings } from '~/models';
import { State } from '~/store';
import { DatasetState, getDataset } from '~/store/dataset';
import * as Products from '~/store/products';
import * as Recipes from '~/store/recipe';
import * as Settings from '~/store/settings';

enum ModuleId {
  None,
  Speed1,
  Speed2,
  Speed3,
  Prod1,
  Prod2,
  Prod3,
  Eff1,
  Eff2,
  Eff3,
}

const moduleN: Entities<ModuleId> = {
  [ItemId.Module]: ModuleId.None,
  [ItemId.SpeedModule1]: ModuleId.Speed1,
  [ItemId.SpeedModule2]: ModuleId.Speed2,
  [ItemId.SpeedModule3]: ModuleId.Speed3,
  [ItemId.ProductivityModule1]: ModuleId.Prod1,
  [ItemId.ProductivityModule2]: ModuleId.Prod2,
  [ItemId.ProductivityModule3]: ModuleId.Prod3,
  [ItemId.EfficiencyModule1]: ModuleId.Eff1,
  [ItemId.EfficiencyModule2]: ModuleId.Eff2,
  [ItemId.EfficiencyModule3]: ModuleId.Eff3,
};

const moduleI: NEntities<ItemId> = {
  [ModuleId.None]: ItemId.Module,
  [ModuleId.Speed1]: ItemId.SpeedModule1,
  [ModuleId.Speed2]: ItemId.SpeedModule2,
  [ModuleId.Speed3]: ItemId.SpeedModule3,
  [ModuleId.Prod1]: ItemId.ProductivityModule1,
  [ModuleId.Prod2]: ItemId.ProductivityModule2,
  [ModuleId.Prod3]: ItemId.ProductivityModule3,
  [ModuleId.Eff1]: ItemId.EfficiencyModule1,
  [ModuleId.Eff2]: ItemId.EfficiencyModule2,
  [ModuleId.Eff3]: ItemId.EfficiencyModule3,
};

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  loaded: boolean;
  unzipping: boolean;
  zip: string;

  constructor(private router: Router, private store: Store<State>) {
    this.router.events.subscribe((e) => this.updateState(e));
  }

  updateUrl(
    products: Product[],
    recipes: Recipes.RecipeState,
    settings: Settings.SettingsState,
    data: DatasetState
  ) {
    if (this.loaded && !this.unzipping) {
      const zProducts = this.zipProducts(products, data);
      let zState = `p=${zProducts.join(',')}`;
      const zRecipes = this.zipRecipes(recipes, data);
      if (zRecipes.length) {
        zState += `&r=${zRecipes.join(',')}`;
      }
      const zSettings = this.zipSettings(settings, data);
      if (zSettings) {
        zState += `&s=${zSettings}`;
      }
      this.zip = btoa(pako.deflate(zState, { to: 'string' }));
      this.router.navigateByUrl(`#${this.zip}`);
    } else {
      this.loaded = true;
    }
  }

  updateState(e: Event) {
    try {
      if (e instanceof NavigationEnd) {
        const fragments = e.url.split('#');
        if (fragments.length > 1) {
          const urlZip = fragments[fragments.length - 1];
          if (this.zip !== urlZip) {
            const state: string = pako.inflate(atob(urlZip), { to: 'string' });
            const params = state.split('&');
            this.store
              .select(getDataset)
              .pipe(
                filter((d) => !!d),
                take(1)
              )
              .subscribe((data) => {
                this.unzipping = true;
                for (const p of params) {
                  const s = p.split('=');
                  if (s[0] === 'p') {
                    this.unzipProducts(s[1].split(','), data);
                  } else if (s[0] === 'r') {
                    this.unzipRecipes(s[1].split(','), data);
                  } else if (s[0] === 's') {
                    this.unzipSettings(s[1], data);
                  }
                }
              });
          }
        }
      }
    } catch (e) {
      console.error('Navigation failed.');
      console.error(e);
    } finally {
      this.unzipping = false;
    }
  }

  zipProducts(products: Product[], data: DatasetState): string[] {
    return products.map((product) => {
      const i = data.itemN[product.itemId];
      const t = product.rateType;
      const r = product.rate;
      return `${i}:${t}:${r}`;
    });
  }

  unzipProducts(zProducts: string[], data: DatasetState) {
    const products: Product[] = [];
    let n = 0;
    for (const product of zProducts) {
      const p = product.split(':');
      products.push({
        id: n,
        itemId: data.itemI[p[0]],
        rateType: Number(p[1]),
        rate: Number(p[2]),
      });
      n++;
    }
    this.store.dispatch(new Products.LoadAction(products));
  }

  zipRecipes(state: Recipes.RecipeState, data: DatasetState): string[] {
    return Object.keys(state).map((id) => {
      const settings = state[id];
      const i = data.recipeN[id];
      const ig = settings.ignore == null ? '' : settings.ignore ? 1 : 0;
      const ln = settings.lane == null ? '' : data.itemN[settings.lane];
      const fc = settings.factory == null ? '' : data.itemN[settings.factory];
      const md =
        settings.modules == null
          ? ''
          : settings.modules.map((m) => moduleN[m]).join('.');
      const bt =
        settings.beaconType == null ? '' : moduleN[settings.beaconType];
      const bc = settings.beaconCount == null ? '' : settings.beaconCount;
      return `${i}:${ig}:${ln}:${fc}:${md}:${bt}:${bc}`;
    });
  }

  unzipRecipes(zRecipes: string[], data: DatasetState) {
    const recipes: Recipes.RecipeState = {};
    for (const recipe of zRecipes) {
      const r = recipe.split(':');
      const u: RecipeSettings = {};
      if (r[1] !== '') {
        u.ignore = r[1] === '1' ? true : false;
      }
      if (r[2] !== '') {
        u.lane = data.itemI[r[2]];
      }
      if (r[3] !== '') {
        u.factory = data.itemI[r[3]];
      }
      if (r[4] !== '') {
        u.modules = r[4].split('.').map((m) => moduleI[Number(m)]);
      }
      if (r[5] !== '') {
        u.beaconType = moduleI[Number(r[5])];
      }
      if (r[6] !== '') {
        u.beaconCount = Number(r[6]);
      }
      recipes[data.recipeI[r[0]]] = u;
    }
    this.store.dispatch(new Recipes.LoadAction(recipes));
  }

  zipSettings(state: Settings.SettingsState, data: DatasetState): string {
    const init = Settings.initialSettingsState;
    if (state === init) {
      return null;
    }
    const dr = state.displayRate === init.displayRate ? '' : state.displayRate;
    const pr = state.precision === init.precision ? '' : state.precision;
    const tb = state.belt === init.belt ? '' : data.itemN[state.belt];
    const pa =
      state.assembler === init.assembler ? '' : data.itemN[state.assembler];
    const pf = state.furnace === init.furnace ? '' : data.itemN[state.furnace];
    const mp =
      state.prodModule === init.prodModule ? '' : moduleN[state.prodModule];
    const mo =
      state.otherModule === init.otherModule ? '' : moduleN[state.otherModule];
    const bt =
      state.beaconType === init.beaconType ? '' : moduleN[state.beaconType];
    const bc = state.beaconCount === init.beaconCount ? '' : state.beaconCount;
    const or =
      state.oilRecipe === init.oilRecipe ? '' : data.recipeN[state.oilRecipe];
    const fl = state.fuel === init.fuel ? '' : data.itemN[state.fuel];
    const mb = state.miningBonus === init.miningBonus ? '' : state.miningBonus;
    const rs =
      state.researchSpeed === init.researchSpeed ? '' : state.researchSpeed;
    const fr = state.flowRate === init.flowRate ? '' : state.flowRate;
    return `${dr}:${pr}:${tb}:${pa}:${pf}:${mp}:${mo}:${bt}:${bc}:${or}:${fl}:${mb}:${rs}:${fr}`;
  }

  unzipSettings(zSettings: string, data: DatasetState) {
    const s = zSettings.split(':');
    const settings: Settings.SettingsState = {} as any;
    if (s[0] !== '') {
      settings.displayRate = Number(s[0]);
    }
    if (s[1] !== '') {
      settings.precision = Number(s[1]);
    }
    if (s[2] !== '') {
      settings.belt = data.itemI[s[2]];
    }
    if (s[3] !== '') {
      settings.assembler = data.itemI[s[3]];
    }
    if (s[4] !== '') {
      settings.furnace = data.itemI[s[4]];
    }
    if (s[5] !== '') {
      settings.prodModule = moduleI[Number(s[6])];
    }
    if (s[6] !== '') {
      settings.otherModule = moduleI[Number(s[7])];
    }
    if (s[7] !== '') {
      settings.beaconType = moduleI[Number(s[8])];
    }
    if (s[8] !== '') {
      settings.beaconCount = Number(s[9]);
    }
    if (s[9] !== '') {
      settings.oilRecipe = data.recipeI[s[10]];
    }
    if (s[10] !== '') {
      settings.fuel = data.itemI[s[11]];
    }
    if (s[11] !== '') {
      settings.miningBonus = Number(s[12]);
    }
    if (s[12] !== '') {
      settings.researchSpeed = Number(s[13]);
    }
    if (s[13] !== '') {
      settings.flowRate = Number(s[14]);
    }
    this.store.dispatch(new Settings.LoadAction(settings));
  }
}
