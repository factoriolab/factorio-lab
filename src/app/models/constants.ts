import { Rational } from './rational';

export const WAGON_STACKS = new Rational(BigInt(40));
export const WAGON_FLUID = new Rational(BigInt(25000));
export const MIN_LINK_VALUE = 1e-10;
export const STATE_KEY = 'state';
export const ERROR_SIMPLEX = `No solution found. Check your disabled recipes to ensure a solution is feasible.

E.G.: If one iron plate requires two gears, and one gear requires two iron plates, a solution for iron plates is not feasible.`;
export const WARNING_RESET = `\u26a0 Warning:
This will delete ALL saved Factorio Lab settings in this browser, are you sure?`;
export const WARNING_HANG = `No solution found in 5 seconds. Continue trying to solve?
To avoid this issue, try disabling some recipes.
\u26a0 Warning: The browser may hang if you choose to continue.

(Click "OK" to keep trying, click "Cancel" to quit)`;
