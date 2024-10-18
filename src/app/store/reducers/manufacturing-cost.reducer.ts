import { createReducer, on } from '@ngrx/store';
import { updateManufacturingCosts } from '../actions/manufacturing-cost.actions';

export interface ManufacturingCostState {
  totalCost: number;
}

export const initialState: ManufacturingCostState = {
  totalCost: 0,
};

const _manufacturingCostReducer = createReducer(
  initialState,
  on(updateManufacturingCosts, (state, { totalCost }) => ({
    ...state,
    totalCost,
  }))
);

export function manufacturingCostReducer(state: any, action: any) {
  return _manufacturingCostReducer(state, action);
}
