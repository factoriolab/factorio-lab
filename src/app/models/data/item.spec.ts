import { Rational } from '../rational';
import { RationalItem, ItemId } from './item';
import { CategoryId } from './category';

describe('RationalItem', () => {
  describe('constructor', () => {
    it('should fill in all fields', () => {
      const result = new RationalItem({
        id: ItemId.Wood,
        name: 'name',
        category: CategoryId.Combat,
        row: 1,
        stack: 2,
        belt: {
          speed: 1,
        },
        factory: {
          speed: 1,
          modules: 0,
        },
        module: {
          speed: 1,
          productivity: 1,
          energy: 1,
        },
        fuel: 2,
      });
      expect(result.id).toEqual(ItemId.Wood);
      expect(result.name).toEqual('name');
      expect(result.category).toEqual(CategoryId.Combat);
      expect(result.row).toEqual(1);
      expect(result.stack).toEqual(Rational.two);
      expect(result.belt.speed).toEqual(Rational.one);
      expect(result.factory.speed).toEqual(Rational.one);
      expect(result.factory.modules).toEqual(0);
      expect(result.module.speed).toEqual(Rational.one);
      expect(result.module.productivity).toEqual(Rational.one);
      expect(result.module.energy).toEqual(Rational.one);
      expect(result.fuel).toEqual(Rational.two);
    });

    it('should ignore undefined expensive fields', () => {
      const result = new RationalItem({
        id: ItemId.Wood,
        name: 'name',
        category: CategoryId.Combat,
        row: 1,
      });
      expect(result.id).toEqual(ItemId.Wood);
      expect(result.name).toEqual('name');
      expect(result.category).toEqual(CategoryId.Combat);
      expect(result.row).toEqual(1);
      expect(result.stack).toBeUndefined();
      expect(result.belt).toBeUndefined();
      expect(result.factory).toBeUndefined();
      expect(result.module).toBeUndefined();
      expect(result.fuel).toBeUndefined();
    });
  });
});
