import * as Mocks from 'src/mocks';
import { Step, ItemId, Rational, RecipeId } from '~/models';
import { MatrixUtility, MatrixSolver } from './matrix';

describe('MatrixUtility', () => {
  describe('solveMatricesFor', () => {
    it('should return if only simple steps are found', () => {
      const steps: Step[] = [
        {
          itemId: ItemId.SteelChest,
          items: Rational.one,
          recipeId: RecipeId.SteelChest,
        },
      ];
      MatrixUtility.solveMatricesFor(
        steps,
        Mocks.ItemSettingsInitial,
        Mocks.RecipeSettingsInitial,
        ItemId.Coal,
        RecipeId.BasicOilProcessing,
        Mocks.AdjustedData
      );
      expect(steps[0].factories).toBeFalsy();
    });

    it('should return if no matrix recipes are found', () => {
      const steps: Step[] = [
        {
          itemId: ItemId.HeavyOil,
          items: Rational.one,
        },
      ];
      MatrixUtility.solveMatricesFor(
        steps,
        Mocks.ItemSettingsInitial,
        Mocks.RecipeSettingsInitial,
        ItemId.Coal,
        RecipeId.BasicOilProcessing,
        Mocks.AdjustedData
      );
      expect(steps[0].factories).toBeFalsy();
    });

    it('should solve a matrix', () => {
      const steps: Step[] = [
        {
          itemId: ItemId.PetroleumGas,
          items: Rational.one,
        },
      ];
      MatrixUtility.solveMatricesFor(
        steps,
        Mocks.ItemSettingsInitial,
        Mocks.RecipeSettingsInitial,
        ItemId.Coal,
        RecipeId.BasicOilProcessing,
        Mocks.AdjustedData
      );
      expect(steps[0].factories).toBeTruthy();
    });
  });
});

describe('MatrixSolver', () => {
  let matrix: MatrixSolver;

  beforeEach(() => {
    const steps: Step[] = [
      {
        itemId: ItemId.SteelChest,
        items: Rational.one,
        recipeId: RecipeId.SteelChest,
      },
    ];
    matrix = new MatrixSolver(
      steps,
      Mocks.ItemSettingsInitial,
      Mocks.RecipeSettingsInitial,
      ItemId.Coal,
      RecipeId.BasicOilProcessing,
      Mocks.AdjustedData
    );
  });

  describe('simpleStepsOnly', () => {
    it('should determine whether matrix contains only simple recipes', () => {
      expect(matrix.simpleStepsOnly).toBeTrue();
      matrix.steps[0].recipeId = null;
      expect(matrix.simpleStepsOnly).toBeFalse();
    });
  });

  describe('simpleRecipesOnly', () => {
    it('should determine whether matrix contains matching complex recipes', () => {
      matrix.calculateRecipes();
      expect(matrix.simpleRecipesOnly).toBeTrue();
      matrix.steps[0].itemId = ItemId.PetroleumGas;
      matrix.steps[0].recipeId = null;
      matrix.calculateRecipes();
      expect(matrix.simpleRecipesOnly).toBeFalse();
    });
  });

  describe('solve', () => {
    it('should call the solution methods', () => {
      spyOn(matrix, 'parseRecipes');
      spyOn(matrix, 'parseItems');
      spyOn(matrix, 'parseCost');
      spyOn(matrix.solver, 'updateVariables');
      spyOn(matrix, 'parseSolutionRecipes');
      spyOn(matrix, 'parseSolutionOutputs');
      spyOn(matrix, 'parseSolutionSteps');
      spyOn(matrix, 'parseSolutionInputs');
      matrix.solve();
      expect(matrix.parseRecipes).toHaveBeenCalled();
      expect(matrix.parseItems).toHaveBeenCalled();
      expect(matrix.parseCost).toHaveBeenCalled();
      expect(matrix.solver.updateVariables).toHaveBeenCalled();
      expect(matrix.parseSolutionRecipes).toHaveBeenCalled();
      expect(matrix.parseSolutionOutputs).toHaveBeenCalled();
      expect(matrix.parseSolutionSteps).toHaveBeenCalled();
      expect(matrix.parseSolutionInputs).toHaveBeenCalled();
    });
  });

  describe('parseRecipes', () => {
    it('should parse a standard oil recipe', () => {
      matrix.recipeIds.push(RecipeId.AdvancedOilProcessing);
      matrix.parseRecipes();
      expect(Object.keys(matrix.items).length).toEqual(5);
      expect(matrix.outputs.length).toEqual(3);
      expect(matrix.recipeVar[RecipeId.AdvancedOilProcessing]).toBeTruthy();
      expect(matrix.itemIds.length).toEqual(5);
      expect(matrix.solver.variables.length).toEqual(1);
      expect(matrix.solver.constraints.length).toEqual(2);
    });

    it('should parse a recipe with no inputs', () => {
      matrix.recipeIds.push(RecipeId.IronOre);
      matrix.parseRecipes();
      expect(Object.keys(matrix.items).length).toEqual(1);
      expect(matrix.outputs.length).toEqual(1);
      expect(matrix.recipeVar[RecipeId.IronOre]).toBeTruthy();
      expect(matrix.itemIds.length).toEqual(1);
      expect(matrix.solver.variables.length).toEqual(1);
      expect(matrix.solver.constraints.length).toEqual(2);
    });

    it('should ignore duplicate items', () => {
      matrix.recipeIds.push(RecipeId.IronOre);
      matrix.recipeIds.push(RecipeId.IronOre);
      matrix.parseRecipes();
      expect(Object.keys(matrix.items).length).toEqual(1);
      expect(matrix.outputs.length).toEqual(1);
      expect(matrix.recipeVar[RecipeId.IronOre]).toBeTruthy();
      expect(matrix.itemIds.length).toEqual(1);
      expect(matrix.solver.variables.length).toEqual(2);
      expect(matrix.solver.constraints.length).toEqual(4);
    });
  });

  describe('parseItems', () => {
    it('should parse a standard item', () => {
      matrix.recipeIds.push(RecipeId.BasicOilProcessing);
      matrix.parseRecipes();
      matrix.parseItems();
      expect(Object.keys(matrix.inputVar).length).toEqual(1);
      expect(Object.keys(matrix.surplusVar).length).toEqual(2);
      expect(matrix.solver.variables.length).toEqual(4);
      expect(matrix.solver.constraints.length).toEqual(9);
    });

    it('should parse an item with desired value', () => {
      matrix.value[ItemId.PetroleumGas] = Rational.one;
      matrix.recipeIds.push(RecipeId.BasicOilProcessing);
      matrix.parseRecipes();
      matrix.parseItems();
      expect(Object.keys(matrix.inputVar).length).toEqual(1);
      expect(Object.keys(matrix.surplusVar).length).toEqual(2);
      expect(matrix.solver.variables.length).toEqual(4);
      expect(matrix.solver.constraints.length).toEqual(9);
    });

    it('should parse a recipe with no inputs', () => {
      matrix.recipeIds.push(RecipeId.IronOre);
      matrix.parseRecipes();
      matrix.parseItems();
      expect(Object.keys(matrix.inputVar).length).toEqual(0);
      expect(Object.keys(matrix.surplusVar).length).toEqual(1);
      expect(matrix.solver.variables.length).toEqual(2);
      expect(matrix.solver.constraints.length).toEqual(5);
    });
  });

  describe('parseCost', () => {
    it('should add cost constraints', () => {
      matrix.recipeIds.push(RecipeId.BasicOilProcessing);
      matrix.parseRecipes();
      matrix.parseItems();
      matrix.parseCost();
      expect(matrix.solver.variables.length).toEqual(6);
      expect(matrix.solver.constraints.length).toEqual(13);
    });

    it('should handle inputs', () => {
      matrix.recipeIds.push(RecipeId.AdvancedOilProcessing);
      matrix.recipeIds.push(RecipeId.CoalLiquefaction);
      matrix.parseRecipes();
      matrix.parseItems();
      matrix.parseCost();
      expect(matrix.solver.variables.length).toEqual(15);
      expect(matrix.solver.constraints.length).toEqual(33);
    });
  });

  describe('parseSolutionRecipes', () => {
    it('should map used recipe ids', () => {
      matrix.recipeVar[RecipeId.IronOre] = { value: () => Rational.one } as any;
      matrix.parseSolutionRecipes();
      expect(matrix.usedRecipeIds).toEqual([RecipeId.IronOre]);
    });
  });

  describe('parseSolutionOutputs', () => {
    it('should parse outputs from solver', () => {
      matrix.steps[0].itemId = ItemId.HeavyOil;
      matrix.steps[0].recipeId = null;
      matrix.oilRecipe = RecipeId.AdvancedOilProcessing;
      matrix.calculateRecipes();
      // Add dummy recipe with no inputs
      matrix.recipeIds.push(RecipeId.IronOre);
      matrix.parseRecipes();
      matrix.parseItems();
      matrix.parseCost();
      matrix.solver.updateVariables();
      // Simulate an output that has already been calculated
      matrix.steps.push({ itemId: ItemId.LightOil, items: Rational.zero });
      matrix.parseSolutionRecipes();
      matrix.parseSolutionOutputs();
      expect(matrix.steps).toEqual([
        {
          itemId: ItemId.HeavyOil,
          items: Rational.one,
          recipeId: RecipeId.AdvancedOilProcessing,
          factories: new Rational(BigInt(4), BigInt(15)),
        },
        {
          itemId: ItemId.LightOil,
          items: Rational.zero,
          surplus: new Rational(BigInt(9), BigInt(5)),
        },
        {
          itemId: ItemId.PetroleumGas,
          items: Rational.zero,
          surplus: new Rational(BigInt(11), BigInt(5)),
        },
      ]);
    });
  });
});
