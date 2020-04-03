import * as mocks from 'src/mocks';
import { initialSettingsState } from '../settings';
import { initialRecipeState } from './recipe.reducer';
import * as selectors from './recipe.selectors';

describe('Recipe Selectors', () => {
  const stringValue = 'value';
  const numberValue = 2;

  describe('getRecipeSettings', () => {
    it('should handle null/empty values', () => {
      const result = selectors.getRecipeSettings.projector({}, [], {}, {});
      expect(Object.keys(result).length).toEqual(0);
    });

    it('should return the recipe settings', () => {
      const result = selectors.getRecipeSettings.projector(
        initialRecipeState,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(Object.keys(result).length).toEqual(mocks.Data.recipes.length);
    });

    it('should use belt override', () => {
      const state = {
        ...initialRecipeState,
        ...{ [mocks.Item1.id]: { belt: stringValue } }
      };
      const result = selectors.getRecipeSettings.projector(
        state,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(result[mocks.Item1.id].belt).toEqual(stringValue);
    });

    it('should use factory override', () => {
      const state = {
        ...initialRecipeState,
        ...{ [mocks.Item1.id]: { factory: stringValue } }
      };
      const result = selectors.getRecipeSettings.projector(
        state,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(result[mocks.Item1.id].factory).toEqual(stringValue);
    });

    it('should use module override', () => {
      const state = {
        ...initialRecipeState,
        ...{ [mocks.Item1.id]: { modules: [stringValue] } }
      };
      const result = selectors.getRecipeSettings.projector(
        state,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(result[mocks.Item1.id].modules).toEqual([stringValue]);
    });

    it('should use beacon type override', () => {
      const state = {
        ...initialRecipeState,
        ...{ [mocks.Item1.id]: { beaconType: stringValue } }
      };
      const result = selectors.getRecipeSettings.projector(
        state,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(result[mocks.Item1.id].beaconType).toEqual(stringValue);
    });

    it('should use beacon count override', () => {
      const state = {
        ...initialRecipeState,
        ...{ [mocks.Item1.id]: { beaconCount: numberValue } }
      };
      const result = selectors.getRecipeSettings.projector(
        state,
        mocks.Data.recipes,
        mocks.ItemEntities,
        initialSettingsState
      );
      expect(result[mocks.Item1.id].beaconCount).toEqual(numberValue);
    });
  });

  describe('getRecipeFactors', () => {
    const recipeSettings = selectors.getRecipeSettings.projector(
      initialRecipeState,
      mocks.Data.recipes,
      mocks.ItemEntities,
      initialSettingsState
    );

    it('should handle null/empty values', () => {
      const result = selectors.getRecipeFactors.projector({}, {});
      expect(Object.keys(result).length).toEqual(0);
    });

    it('should return recipe speed/prod factors', () => {
      const result = selectors.getRecipeFactors.projector(
        recipeSettings,
        mocks.ItemEntities
      );
      expect(Object.keys(result).length).toEqual(mocks.Data.recipes.length);
    });
  });
});
