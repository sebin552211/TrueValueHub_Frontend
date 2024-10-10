import { Component, EventEmitter, Output } from '@angular/core';
import { Part } from '../../../core/Interfaces/Part.interface';
import { PartService } from '../../../core/Services/part.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css']
})
export class SidePanelComponent {
  searchTerm: string = '';
  filteredItems: Part[] = [];
  selectedPart: Part | null = null;

  @Output() partSelected = new EventEmitter<Part>();

  constructor(private partService: PartService) {}

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement; 
    this.searchTerm = input.value;
  
    if (this.searchTerm) {
      this.partService.getPartById(this.searchTerm).subscribe(
        (part) => {
          this.filteredItems = [part]; // Show matched part in dropdown
          console.log('Fetched part data:', part); // Log part data
        },
        (error) => {
          console.error('Error fetching part:', error); // Enhanced error logging
          this.filteredItems = []; // Clear filtered items on error
        }
      );
    } else {
      this.filteredItems = []; // Clear filtered items if input is empty
    }
  }
  

  selectPart(part: Part) {
    this.searchTerm = part.internalPartNumber; // Set search box value to selected part
    this.filteredItems = []; // Clear the dropdown
    this.selectedPart = part;
    this.partSelected.emit(part); // Emit the selected part to parent component
    console.log('Selected part emitted:', part); // Debug log
  }
}
