import { Mocks } from 'src/tests';
import { StoreUtility } from '~/utilities';
import { AppLoadAction } from '../app.actions';
import * as Actions from './recipes.actions';
import { recipesReducer, initialRecipesState } from './recipes.reducer';

describe('Recipes Reducer', () => {
  const numberValue = 2;

  describe('LOAD', () => {
    it('should load recipe settings', () => {
      const result = recipesReducer(
        undefined,
        new AppLoadAction({ recipesState: Mocks.RecipeSettingsEntities } as any)
      );
      expect(result).toEqual(Mocks.RecipeSettingsEntities);
    });
  });

  describe('SET_FACTORY', () => {
    it('should set the factory', () => {
      const result = recipesReducer(
        initialRecipesState,
        new Actions.SetFactoryAction({
          id: Mocks.Recipe1.id,
          value: Mocks.Item1.id,
          default: null,
        })
      );
      expect(result[Mocks.Recipe1.id].factory).toEqual(Mocks.Item1.id);
    });
  });

  describe('SET_MODULES', () => {
    it('should set the modules', () => {
      const result = recipesReducer(
        initialRecipesState,
        new Actions.SetModulesAction({
          id: Mocks.Recipe1.id,
          value: [Mocks.Item1.id],
          default: null,
        })
      );
      expect(result[Mocks.Recipe1.id].modules).toEqual([Mocks.Item1.id]);
    });
  });

  describe('SET_BEACON_MODULE', () => {
    it('should set the beacon module', () => {
      const result = recipesReducer(
        initialRecipesState,
        new Actions.SetBeaconModuleAction({
          id: Mocks.Recipe1.id,
          value: Mocks.Item1.id,
          default: null,
        })
      );
      expect(result[Mocks.Recipe1.id].beaconModule).toEqual(Mocks.Item1.id);
    });
  });

  describe('SET_BEACONS_COUNT', () => {
    it('should set the beacon count', () => {
      const result = recipesReducer(
        initialRecipesState,
        new Actions.SetBeaconCountAction({
          id: Mocks.Recipe1.id,
          value: numberValue,
          default: null,
        })
      );
      expect(result[Mocks.Recipe1.id].beaconCount).toEqual(numberValue);
    });
  });

  describe('RESET', () => {
    it('should reset a recipe', () => {
      const result = recipesReducer(
        initialRecipesState,
        new Actions.ResetAction(Mocks.Recipe1.id)
      );
      expect(result[Mocks.Recipe1.id]).toBeUndefined();
    });
  });

  describe('RESET_FACTORY', () => {
    it('should call resetField', () => {
      spyOn(StoreUtility, 'resetField');
      recipesReducer(null, new Actions.ResetFactoryAction());
      expect(StoreUtility.resetField).toHaveBeenCalledWith(null, 'factory');
    });
  });

  describe('RESET_MODULES', () => {
    it('should call resetField', () => {
      spyOn(StoreUtility, 'resetField');
      recipesReducer(null, new Actions.ResetModulesAction());
      expect(StoreUtility.resetField).toHaveBeenCalledWith(null, 'modules');
    });
  });

  describe('RESET_BEACONS', () => {
    it('should call resetField', () => {
      spyOn(StoreUtility, 'resetField');
      recipesReducer(null, new Actions.ResetBeaconsAction());
      expect(StoreUtility.resetField).toHaveBeenCalledWith(
        null,
        'beaconModule'
      );
      expect(StoreUtility.resetField).toHaveBeenCalledWith(
        undefined,
        'beaconCount'
      );
    });
  });

  it('should return default state', () => {
    expect(recipesReducer(undefined, { type: 'Test' } as any)).toBe(
      initialRecipesState
    );
  });
});
