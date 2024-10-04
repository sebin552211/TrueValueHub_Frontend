import { Component, EventEmitter, Output } from '@angular/core';
import { Part } from '../../core/Interfaces/Part.interface'
import { PartService } from '../../core/Services/part.service';
import { ItemListComponent } from '../item-list/item-list.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [ItemListComponent,CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrl: './side-panel.component.css'
})
export class SidePanelComponent {
  searchTerm: string = '';
  filteredItems: Part[] = [];
  allItems: any[] = [/* Array of items with internalPartNumber */];


  @Output() partSelected = new EventEmitter<Part>();

  constructor(private partService: PartService) {}

  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement; 
    this.searchTerm = input.value;

    if (this.searchTerm) {
      this.partService.getPartById(this.searchTerm).subscribe(
        (part) => {
          this.filteredItems = [part]; // Show matched part in dropdown
        },
        (error) => {
          console.error('Error fetching part:', error);
          this.filteredItems = []; // Clear filtered items on error
        }
      );
    } else {
      this.filteredItems = []; // Clear filtered items if input is empty
    }
  }

  selectPart(part: Part) {
    this.searchTerm = part.internalPartNumber; // Set the input to the selected part ID
    this.filteredItems = []; // Clear the dropdown
    this.partSelected.emit(part); // Emit the selected part details
  }
}
