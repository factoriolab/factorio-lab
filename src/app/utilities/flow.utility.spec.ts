import { ItemId, Mocks, RecipeId } from 'src/tests';
import {
  LinkValue,
  MIN_LINK_VALUE,
  Rational,
  Step,
  Node,
  Link,
  DisplayRate,
} from '~/models';
import { FlowUtility } from './flow.utility';

describe('FlowUtility', () => {
  describe('getSankey', () => {
    const node: Node = {
      id: ItemId.Coal,
      name: Mocks.AdjustedData.itemEntities[ItemId.Coal].name,
      color: Mocks.AdjustedData.iconEntities[ItemId.Coal].color,
      viewBox: '960 768 64 64',
      href: Mocks.AdjustedData.iconEntities[ItemId.Coal].file,
    };

    it('should handle empty/null values', () => {
      const result = FlowUtility.buildSankey([], null, null, null);
      expect(result).toEqual({ nodes: [], links: [] });
    });

    it('should handle normal steps', () => {
      const result = FlowUtility.buildSankey(
        [
          {
            itemId: ItemId.Coal,
            recipeId: RecipeId.Coal,
            parents: { [ItemId.PlasticBar]: Rational.one },
          },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({
        nodes: [node],
        links: [
          {
            target: ItemId.PlasticBar,
            source: ItemId.Coal,
            value: 1,
            dispValue: '',
            name: Mocks.AdjustedData.itemEntities[ItemId.Coal].name,
            color: Mocks.AdjustedData.iconEntities[ItemId.Coal].color,
          },
        ],
      });
    });

    it('should handle normal step with no parents', () => {
      const result = FlowUtility.buildSankey(
        [
          {
            itemId: ItemId.Coal,
            recipeId: RecipeId.Coal,
          },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({ nodes: [node], links: [] });
    });

    it('should handle mismatched step', () => {
      const result = FlowUtility.buildSankey(
        [
          { itemId: ItemId.Coal, items: Rational.one },
          { recipeId: RecipeId.Coal, factories: Rational.one, outputs: {} },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({
        nodes: [node, node],
        links: [
          {
            target: ItemId.Coal,
            source: ItemId.Coal,
            value: 1,
            dispValue: '',
            name: Mocks.AdjustedData.itemEntities[ItemId.Coal].name,
            color: Mocks.AdjustedData.iconEntities[ItemId.Coal].color,
          },
        ],
      });
    });

    it('should handle steps with no recipe', () => {
      const result = FlowUtility.buildSankey(
        [
          {
            itemId: ItemId.Coal,
            parents: { [ItemId.PlasticBar]: Rational.one },
          },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({
        nodes: [node],
        links: [
          {
            target: ItemId.PlasticBar,
            source: ItemId.Coal,
            value: 1,
            dispValue: '',
            name: Mocks.AdjustedData.itemEntities[ItemId.Coal].name,
            color: Mocks.AdjustedData.iconEntities[ItemId.Coal].color,
          },
        ],
      });
    });

    it('should handle steps with no recipe and no-input parent', () => {
      const result = FlowUtility.buildSankey(
        [
          {
            itemId: ItemId.Coal,
            parents: { [ItemId.IronOre]: Rational.one },
          },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({ nodes: [node], links: [] });
    });

    it('should handle steps with no recipe or parents', () => {
      const result = FlowUtility.buildSankey(
        [{ itemId: ItemId.Coal }] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      expect(result).toEqual({ nodes: [node], links: [] });
    });

    it('should handle recipe that matches id with extra outputs', () => {
      const result = FlowUtility.buildSankey(
        [
          {
            itemId: RecipeId.UraniumProcessing,
            recipeId: RecipeId.UraniumProcessing,
            factories: Rational.one,
            outputs: {},
          },
          {
            itemId: RecipeId.UraniumProcessing,
            recipeId: RecipeId.UraniumProcessing,
            factories: Rational.one,
            parents: {},
            outputs: {},
          },
          {
            itemId: ItemId.Uranium235,
            items: Rational.zero,
          },
          {
            itemId: ItemId.Uranium238,
            items: Rational.zero,
          },
        ] as any[],
        LinkValue.None,
        null,
        Mocks.AdjustedData
      );
      const name =
        Mocks.AdjustedData.recipeEntities[RecipeId.UraniumProcessing].name;
      const color =
        Mocks.AdjustedData.iconEntities[RecipeId.UraniumProcessing].color;
      const href =
        Mocks.AdjustedData.iconEntities[RecipeId.UraniumProcessing].file;
      const uNode: Node = {
        id: RecipeId.UraniumProcessing,
        name,
        color,
        viewBox: '0 448 64 64',
        href,
      };
      const uNode1: Node = {
        id: ItemId.Uranium235,
        name: Mocks.AdjustedData.itemEntities[ItemId.Uranium235].name,
        color: Mocks.AdjustedData.iconEntities[ItemId.Uranium235].color,
        viewBox: '832 832 64 64',
        href,
      };
      const uNode2: Node = {
        id: ItemId.Uranium238,
        name: Mocks.AdjustedData.itemEntities[ItemId.Uranium238].name,
        color: Mocks.AdjustedData.iconEntities[ItemId.Uranium238].color,
        viewBox: '896 832 64 64',
        href,
      };
      const uLink1: Link = {
        target: ItemId.Uranium235,
        source: RecipeId.UraniumProcessing,
        value: 1,
        dispValue: '',
        name: Mocks.AdjustedData.itemEntities[ItemId.Uranium235].name,
        color: Mocks.AdjustedData.iconEntities[ItemId.Uranium235].color,
      };
      const uLink2: Link = {
        target: ItemId.Uranium238,
        source: RecipeId.UraniumProcessing,
        value: 1,
        dispValue: '',
        name: Mocks.AdjustedData.itemEntities[ItemId.Uranium238].name,
        color: Mocks.AdjustedData.iconEntities[ItemId.Uranium238].color,
      };
      expect(result).toEqual({
        nodes: [uNode, uNode, uNode1, uNode2],
        links: [uLink1, uLink2, uLink1, uLink2],
      });
    });
  });

  describe('stepLinkValue', () => {
    const step: Step = {
      itemId: ItemId.IronOre,
      items: Rational.from(5),
      surplus: Rational.from(3),
      belts: Rational.from(4),
      wagons: Rational.from(6),
      factories: Rational.from(7),
    };

    it('should return correct value for none', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.None)).toEqual(
        Rational.one
      );
    });

    it('should return correct value for percent', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.Percent)).toEqual(
        Rational.one
      );
    });

    it('should return correct value for factories when null', () => {
      expect(FlowUtility.stepLinkValue({} as any, LinkValue.Factories)).toEqual(
        Rational.zero
      );
    });

    it('should return correct value for belts', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.Belts)).toEqual(
        Rational.from(4)
      );
    });

    it('should return correct value for wagons', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.Wagons)).toEqual(
        Rational.from(6)
      );
    });

    it('should return correct value for factories', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.Factories)).toEqual(
        Rational.from(7)
      );
    });

    it('should return correct value for items', () => {
      expect(FlowUtility.stepLinkValue(step, LinkValue.Items)).toEqual(
        Rational.from(5)
      );
    });

    it('should return correct value for null items/surplus', () => {
      expect(FlowUtility.stepLinkValue({} as any, LinkValue.Items)).toEqual(
        Rational.zero
      );
    });
  });

  describe('linkValue', () => {
    it('should return correct value for none', () => {
      expect(FlowUtility.linkValue(null, null, LinkValue.None, 100)).toEqual(1);
    });

    it('should return correct value for percent', () => {
      expect(
        FlowUtility.linkValue(null, Rational.two, LinkValue.Percent, 100)
      ).toEqual(2);
    });

    it('should return minimum value for percent', () => {
      expect(
        FlowUtility.linkValue(null, Rational.zero, LinkValue.Percent, 100)
      ).toEqual(MIN_LINK_VALUE);
    });

    it('should multiply percent and value', () => {
      expect(
        FlowUtility.linkValue(Rational.two, new Rational(BigInt(3)), null, 100)
      ).toEqual(6);
    });

    it('should return minimum value', () => {
      expect(
        FlowUtility.linkValue(Rational.zero, Rational.zero, null, 100)
      ).toEqual(MIN_LINK_VALUE);
    });

    it('should scale link size for fluids', () => {
      expect(
        FlowUtility.linkValue(
          Rational.hundred,
          Rational.one,
          LinkValue.Items,
          null
        )
      ).toEqual(10);
    });
  });

  describe('linkDisp', () => {
    it('should return correct value for none', () => {
      expect(FlowUtility.linkDisp(null, null, LinkValue.None, null)).toEqual(
        ''
      );
    });

    it('should return correct value for percent', () => {
      expect(
        FlowUtility.linkDisp(null, Rational.one, LinkValue.Percent, null)
      ).toEqual('100%');
    });

    it('should return correct fractional value', () => {
      expect(
        FlowUtility.linkDisp(
          Rational.from(4, 3),
          Rational.one,
          LinkValue.Items,
          null
        )
      ).toEqual('1 + 1/3');
    });

    it('should return correct decimal value', () => {
      expect(
        FlowUtility.linkDisp(
          Rational.from(4, 3),
          Rational.one,
          LinkValue.Items,
          1
        )
      ).toEqual('1.4');
    });
  });
});
