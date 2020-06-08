import * as kiwi from 'kiwi.js';

import {
  Step,
  Entities,
  RationalRecipe,
  RecipeId,
  RationalItem,
  ItemId,
  Rational,
} from '~/models';
import { RateUtility } from './rate';
import { RationalDataset } from '~/store/dataset';
import { ItemsState } from '~/store/items';
import { RecipesState } from '~/store/recipes';

export class MatrixUtility {
  static solveMatricesFor(
    steps: Step[],
    itemSettings: ItemsState,
    recipeSettings: RecipesState,
    fuel: ItemId,
    oilRecipe: RecipeId,
    data: RationalDataset
  ) {
    if (!steps.some((s) => !s.recipeId && !itemSettings[s.itemId].ignore)) {
      return steps;
    }

    console.log('look for matrix recipes');

    let recipes: Entities<RationalRecipe> = {};
    const value: Entities<number> = {};
    const solver = new kiwi.Solver();

    for (const step of steps) {
      if (!step.recipeId && !itemSettings[step.itemId].ignore) {
        console.log(step.itemId);
        // Find recipes with this output
        const recipeMatches = data.recipeIds
          .map((r) => data.recipeR[r])
          .filter((r) => r.out && r.out[step.itemId]);
        if (recipeMatches.length > 0) {
          value[step.itemId] = step.items.toNumber();
          for (const recipe of recipeMatches) {
            recipes[recipe.id] = recipe;

            // Check inputs for more matrices
            for (const inId of Object.keys(recipe.in)) {
              recipes = this.findComplexRecipesRecursively(
                inId as ItemId,
                recipes,
                data
              );
            }
          }
        }
      }
    }

    if (Object.keys(value).length === 0) {
      return steps;
    }

    console.log('use matrix math');

    switch (oilRecipe) {
      case RecipeId.BasicOilProcessing:
        delete recipes[RecipeId.AdvancedOilProcessing];
        delete recipes[RecipeId.CoalLiquefaction];
        delete recipes[RecipeId.SolidFuelFromLightOil];
        delete recipes[RecipeId.SolidFuelFromHeavyOil];
        break;
      case RecipeId.AdvancedOilProcessing:
        delete recipes[RecipeId.BasicOilProcessing];
        delete recipes[RecipeId.CoalLiquefaction];
        break;
      case RecipeId.CoalLiquefaction:
        delete recipes[RecipeId.BasicOilProcessing];
        delete recipes[RecipeId.AdvancedOilProcessing];
        break;
    }

    console.log(recipes);

    const matrix = 0;

    const items: Entities<RationalItem> = {};
    const recipeVar: Entities<kiwi.Variable> = {};
    const outputs: ItemId[] = [];
    const recipeIds = Object.keys(recipes);
    console.log('iterate recipes');
    for (const r of recipeIds) {
      console.log(r);
      const variable = new kiwi.Variable();
      solver.addEditVariable(variable, kiwi.Strength.weak);
      solver.addConstraint(
        new kiwi.Constraint(new kiwi.Expression(variable), kiwi.Operator.Ge)
      );

      const recipe = data.recipeR[r];
      for (const inId of Object.keys(recipe.in)) {
        items[inId] = data.itemR[inId];
      }
      for (const outId of Object.keys(recipe.out)) {
        items[outId] = data.itemR[outId];
        if (!outputs.some((o) => o === outId)) {
          outputs.push(outId as ItemId);
        }
      }
      recipeVar[r] = variable;
    }

    const surplusVar: Entities<kiwi.Variable> = {};
    const inputVar: Entities<kiwi.Variable> = {};
    console.log('iterate items');
    for (const i of Object.keys(items)) {
      console.log(i);
      const surplus = new kiwi.Variable();
      solver.addEditVariable(surplus, kiwi.Strength.weak);
      solver.addConstraint(
        new kiwi.Constraint(new kiwi.Expression(surplus), kiwi.Operator.Ge)
      );

      let expr = new kiwi.Expression([-1, surplus]);
      if (value[i]) {
        console.log(`need ${value[i]} ${i}`);
        expr = expr.minus(value[i]);
      }
      for (const r of recipeIds) {
        const recipe = data.recipeR[r];
        const rVar = recipeVar[r];
        if (recipe.in) {
          for (const inId of Object.keys(recipe.in).filter((id) => i === id)) {
            console.log(`${r} takes ${recipe.in[inId].toNumber()} ${inId}`);
            expr = expr.minus(
              new kiwi.Expression([recipe.in[inId].toNumber(), rVar])
            );
          }
        }
        if (recipe.out) {
          for (const outId of Object.keys(recipe.out).filter(
            (id) => i === id
          )) {
            console.log(`${r} gives ${recipe.out[outId].toNumber()} ${outId}`);
            expr = expr.plus(
              new kiwi.Expression([recipe.out[outId].toNumber(), rVar])
            );
          }
        }
      }

      if (!outputs.some((o) => o === i)) {
        // Input only
        const inVariable = new kiwi.Variable();
        solver.addEditVariable(inVariable, kiwi.Strength.weak);
        expr = expr.plus(new kiwi.Expression(inVariable));
        inputVar[i] = inVariable;
        console.log(`input: ${i}`);
      }

      solver.addConstraint(new kiwi.Constraint(expr, kiwi.Operator.Eq));
      console.log(expr.terms());
      surplusVar[i] = surplus;
    }

    // Add tax/cost
    const tax = new kiwi.Variable();
    const cost = new kiwi.Variable();
    solver.addEditVariable(tax, kiwi.Strength.weak);
    solver.addEditVariable(cost, kiwi.Strength.weak);

    let factoryExpr = new kiwi.Expression(tax);
    for (const r of recipeIds) {
      factoryExpr = factoryExpr.minus(recipeVar[r]);
      console.log(`factoryExpr: ${r}`);
    }
    let costExpr = new kiwi.Expression(cost);
    for (const i of Object.keys(inputVar)) {
      if (data.recipeR[i]) {
        costExpr = costExpr.minus(new kiwi.Expression([10, inputVar[i]]));
        console.log(`costExpr: 100 ${i}`);
      } else {
        costExpr = costExpr.minus(new kiwi.Expression([100, inputVar[i]]));
        console.log(`costExpr: 100000 ${i}`);
      }
    }

    solver.addConstraint(new kiwi.Constraint(factoryExpr, kiwi.Operator.Eq));
    solver.addConstraint(new kiwi.Constraint(costExpr, kiwi.Operator.Eq));

    solver.suggestValue(cost, 0);

    solver.updateVariables();

    console.log(tax.value());
    console.log(cost.value());
    for (const i of Object.keys(inputVar)) {
      console.log(`inputVar: ${i} ${inputVar[i].value()}`);
    }

    console.log('recipes:');
    for (const r of Object.keys(recipeVar)) {
      console.log(`${r}: ${recipeVar[r].value()}`);
    }

    console.log('outputs:');
    console.log(recipeVar);
    console.log(Object.keys(recipeVar));
    const usedRecipeIds = Object.keys(recipeVar).filter((r) => {
      console.log(r);
      return recipeVar[r].value() > 0;
    });
    const mappedRecipeIds = [];
    for (const i of outputs) {
      const surplusVal = surplusVar[i].value();
      let itemOutput = Rational.zero;
      for (const r of Object.keys(recipeVar)) {
        if (data.recipeR[r].out[i]) {
          const test = data.recipeR[r].out[i];
          itemOutput = itemOutput.add(
            data.recipeR[r].out[i].mul(
              Rational.fromNumber(recipeVar[r].value())
            )
          );
        }
      }
      let step = steps.find((s) => s.itemId === i);
      const matches = usedRecipeIds.filter(
        (r) => !mappedRecipeIds.some((m) => m === r) && data.recipeR[r].out[i]
      );
      const recipeId = matches.length ? matches[0] : null;
      if (step) {
        console.log(`found ${i}`);
        console.log(`${i}: ${step.items.toNumber()}: ${itemOutput.toNumber()}`);
        step.items = itemOutput;
      } else {
        step = {
          itemId: i,
          items: itemOutput,
          matrix,
        };
        steps.push(step);
      }
      if (recipeId) {
        console.log(
          `Recipe for ${i}: ${recipeId}: ${recipeVar[recipeId].value()}`
        );
        step.recipeId = recipeId as RecipeId;
        step.factories = Rational.fromNumber(recipeVar[recipeId].value()).mul(
          data.recipeR[recipeId].time
        );
        mappedRecipeIds.push(recipeId);
      }
      if (surplusVal > 0) {
        step.surplus = Rational.fromNumber(surplusVal);
      }
    }

    for (const r of usedRecipeIds.filter(
      (i) => !mappedRecipeIds.some((m) => m === i)
    )) {
      console.log(r);
      steps.push({
        itemId: null,
        items: null,
        recipeId: r as RecipeId,
        factories: Rational.fromNumber(recipeVar[r].value()).mul(
          data.recipeR[r].time
        ),
        matrix,
      });
    }

    console.log('inputs:');
    for (const i of Object.keys(inputVar)) {
      console.log(`${i}: ${inputVar[i].value()}`);
      const itemVal = -inputVar[i].value();

      // Item has simple recipe, calculate inputs
      const rational = Rational.fromNumber(-1 * itemVal);
      RateUtility.addStepsFor(
        null,
        i as ItemId,
        rational,
        steps,
        itemSettings,
        recipeSettings,
        fuel,
        oilRecipe,
        data
      );
    }

    return steps;
  }

  static findComplexRecipesRecursively(
    itemId: ItemId,
    recipes: Entities<RationalRecipe>,
    data: RationalDataset
  ) {
    if (data.recipeR[itemId]) {
      // Simple recipe
      return recipes;
    }

    // Find recipes with this output that haven't been processed yet
    const recipeMatches = data.recipeIds
      .map((r) => data.recipeR[r])
      .filter(
        (r) =>
          r.out &&
          r.out[itemId] &&
          !Object.keys(recipes).some((x) => x === r.id)
      );

    for (const recipe of recipeMatches) {
      recipes[recipe.id] = recipe;

      // Check inputs for more matrices
      for (const inId of Object.keys(recipe.in)) {
        recipes = this.findComplexRecipesRecursively(
          inId as ItemId,
          recipes,
          data
        );
      }
    }

    return recipes;
  }
}
