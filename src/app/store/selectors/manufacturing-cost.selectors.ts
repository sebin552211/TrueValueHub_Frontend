import { createSelector } from '@ngrx/store';
import { ManufacturingCostState } from '../reducers/manufacturing-cost.reducer'; 

export const selectManufacturingCostState = (state: any) => state.manufacturingCost;

export const selectTotalCost = createSelector(
  selectManufacturingCostState,
  (state: ManufacturingCostState) => state.totalCost
);
