import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectTotalCost } from '../../../store/selectors/manufacturing-cost.selectors';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cost-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cost-summary.component.html',
  styleUrl: './cost-summary.component.css'
})
export class CostSummaryComponent {
  manufacturingCost$: Observable<number>;

  constructor(private store: Store) {
    this.manufacturingCost$ = this.store.select(selectTotalCost);
  }
}
