import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PartService } from '../../../../core/Services/part.service'; // Import the PartService
import { ManufacturingService } from '../../../../core/Services/manufacturing.service'; // Import the ManufacturingService
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PartInfoComponent } from "../part-info/part-info.component";
import { ManufacturingInfoComponent } from "../manufacturing-info/manufacturing-info.component";
import { Part } from '../../../../core/Interfaces/Part.interface';
import { Project } from '../../../../core/Interfaces/project.interface';

// Define the interfaces
export interface AccordionContent {
  type: 'form' | 'text' | 'html'; 
  data: any; 
}

export interface AccordionItem {
  title: string;
  icon: string;
  progress: number;
  isExpanded: boolean;
  content: AccordionContent;
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PartInfoComponent, ManufacturingInfoComponent],
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {
  isEditing: boolean = false; // Control form visibility
  hasChanges: boolean = false; // Track changes
  hasManufacturingChanges: boolean = false;
  loading: boolean = false; // Initialize the loading state

  
  @Input() selectedProject: Project | null = null;
  @Input() searchedProjectId : any | null = null;

  @Input() selectedPart: any | null = null;
  @Output() partSelected = new EventEmitter<Part>();

  @ViewChild(PartInfoComponent) partinfoComponent!:PartInfoComponent;
  @ViewChild(ManufacturingInfoComponent) manufacturinginfoComponent!:ManufacturingInfoComponent;

  ngOnChanges(): void {
    console.log(this.selectedPart);
    console.log(this.selectedProject)
    console.log(this.searchedProjectId);
    
  }

  
  // Constructor to inject services
  constructor(
    private partService: PartService,
    private manufacturingService: ManufacturingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  // Accordion Items Data
  items: AccordionItem[] = [
    { 
      title: 'Part Information', 
      icon: 'fa fa-file', 
      progress: 100, 
      isExpanded: false,  
      content: {
        type: 'form',
        data: []
      }
    },
    { 
      title: 'Manufacturing Information', 
      icon: 'fa fa-industry', 
      progress: 80, 
      isExpanded: false, 
      content: {
        type: 'form',
        data: []
      }
    }
  ];

  FilteredItems: AccordionItem[] = [];

  // Toggle accordion expansion
  toggleItem(item: { isExpanded: boolean; }) {
    item.isExpanded = !item.isExpanded;
  }

  // Expand all accordion items
  expandAll() {
    this.items.forEach(item => item.isExpanded = true);
  }

  // Collapse all accordion items
  collapseAll() {
    this.items.forEach(item => item.isExpanded = false);
  }

  // Update and save method placeholder
  updateAndSave() {
    // Set loading to true to show the loader
    this.loading = true;

    // Call the update functions for the components
    if (this.partinfoComponent) {
        this.partinfoComponent.onUpdate();
    }
    if (this.manufacturinginfoComponent) {      
        this.manufacturinginfoComponent.updateAndSave();
    }

    // Reset changes flags
    this.hasChanges = false;
    this.hasManufacturingChanges = false;

    // Hide loader after 3 seconds
    setTimeout(() => {
        this.loading = false; // Hide the loader
    }, 3000);
}



  // Method to update the state based on changes in part-info component
  onPartInfoChange(changed: boolean) {
    this.hasChanges = changed;
  }

  // Method to update the state based on changes in manufacturing-partinfo component
  onManufacturingChange(changed: boolean) {
    this.hasManufacturingChanges = changed;
  }

  // Recalculate cost method placeholder
  recalculateCost() {
    // Handle recalculation logic here
  }
}
