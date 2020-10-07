import { ItemId, RecipeId } from 'src/tests';
import { Rational } from '../rational';
import { RationalRecipe } from './recipe';

describe('RationalRecipe', () => {
  describe('constructor', () => {
    it('should fill in all fields', () => {
      const result = new RationalRecipe({
        id: RecipeId.AdvancedOilProcessing,
        name: 'name',
        time: 1,
        in: {
          [ItemId.Coal]: 1,
        },
        out: {
          [ItemId.PetroleumGas]: 2,
        },
        expensive: {
          time: 2,
          in: {
            [ItemId.Coal]: 2,
          },
        },
        mining: true,
        producers: [ItemId.AssemblingMachine1],
      });
      expect(result.id).toEqual(RecipeId.AdvancedOilProcessing);
      expect(result.name).toEqual('name');
      expect(result.time).toEqual(Rational.one);
      expect(result.in[ItemId.Coal]).toEqual(Rational.one);
      expect(result.out[ItemId.PetroleumGas]).toEqual(Rational.two);
      expect(result.expensive.time).toEqual(Rational.two);
      expect(result.expensive.in[ItemId.Coal]).toEqual(Rational.two);
      expect(result.mining).toBeTrue();
      expect(result.producers).toEqual([ItemId.AssemblingMachine1]);
    });

    it('should ignore undefined expensive fields', () => {
      const result = new RationalRecipe({
        id: RecipeId.AdvancedOilProcessing,
        name: 'name',
        time: 1,
        expensive: {
          time: 2,
        },
        producers: [ItemId.AssemblingMachine1],
      });
      expect(result.id).toEqual(RecipeId.AdvancedOilProcessing);
      expect(result.name).toEqual('name');
      expect(result.time).toEqual(Rational.one);
      expect(result.producers).toEqual([ItemId.AssemblingMachine1]);
      expect(result.in).toBeUndefined();
      expect(result.out).toBeUndefined();
      expect(result.expensive.time).toEqual(Rational.two);
      expect(result.expensive.in).toBeUndefined();
    });

    it('should ignore undefined fields', () => {
      const result = new RationalRecipe({
        id: RecipeId.AdvancedOilProcessing,
        name: 'name',
        time: 1,
        producers: [ItemId.AssemblingMachine1],
      });
      expect(result.id).toEqual(RecipeId.AdvancedOilProcessing);
      expect(result.name).toEqual('name');
      expect(result.time).toEqual(Rational.one);
      expect(result.producers).toEqual([ItemId.AssemblingMachine1]);
      expect(result.in).toBeUndefined();
      expect(result.out).toBeUndefined();
      expect(result.mining).toBeUndefined();
      expect(result.expensive).toBeUndefined();
    });
  });

  describe('produces', () => {
    const id = 'id';

    it('should handle a recipe that contains the item as input and output', () => {
      const recipe = new RationalRecipe({
        time: 0,
        in: { [id]: 1 },
        out: { [id]: 2 },
      } as any);
      expect(recipe.produces(id)).toBeTrue();
    });

    it('should handle a recipe that contains other outputs', () => {
      const recipe = new RationalRecipe({
        time: 0,
        out: { ['test']: 2 },
      } as any);
      expect(recipe.produces(id)).toBeFalse();
    });

    it('should handle a recipe that matches by id', () => {
      const recipe = new RationalRecipe({
        id,
        time: 0,
        in: { [id]: 0.5 },
      } as any);
      expect(recipe.produces(id)).toBeTrue();
    });

    it('should handle a recipe that does not match', () => {
      const recipe = new RationalRecipe({
        time: 0,
      } as any);
      expect(recipe.produces(id)).toBeFalse();
    });
  });
});
