import { CommonModule } from '@angular/common';
import { Component,Input } from '@angular/core';

@Component({
  selector: 'app-error-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-tooltip.component.html',
  styleUrl: './error-tooltip.component.css'
})
export class ErrorTooltipComponent {
  @Input() message: string | null = null;
}
