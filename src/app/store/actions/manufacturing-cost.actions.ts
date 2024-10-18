import { createAction, props } from '@ngrx/store';

export const updateManufacturingCosts = createAction(
  '[Manufacturing] Update Costs',
  props<{ totalCost: number }>()
);
