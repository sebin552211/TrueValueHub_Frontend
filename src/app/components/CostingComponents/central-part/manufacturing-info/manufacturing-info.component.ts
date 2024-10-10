import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManufacturingService } from '../../../../core/Services/manufacturing.service'; // Adjust the path as necessary
import { Manufacturing } from '../../../../core/Interfaces/Manufacturing.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../../ui/confirm-dialog/confirm-dialog.component'; // Adjust the path as necessary
import { MatSnackBar } from '@angular/material/snack-bar';
import { Part } from '../../../../core/Interfaces/Part.interface'; // Adjust the import path as necessary
import { PartService } from '../../../../core/Services/part.service';
import { ManufacturingUpdateformComponent } from "../manufacturing-updateform/manufacturing-updateform.component";
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-manufacturing-info',
  standalone: true,
  imports: [CommonModule, ManufacturingUpdateformComponent,MatTooltip],
  templateUrl: './manufacturing-info.component.html',
  styleUrls: ['./manufacturing-info.component.css']
})
export class ManufacturingInfoComponent implements OnChanges {
  @Input() manufacturings: Manufacturing[] = []; // Pass the manufacturing data as Input
  @Input() selectedPart: Part | null = null; // Pass selected part as Input
  selectedManufacturing: Manufacturing | null = null; // To handle edit functionality

  @ViewChild(ManufacturingUpdateformComponent) manufacturingupdateformComponent!:ManufacturingUpdateformComponent;

  @Output() Manu_changesMade = new EventEmitter<boolean>();

  onManufacturingFieldChange(changed: boolean) {
    this.Manu_changesMade.emit(changed);
  }

  // Constructor for service and dialogs
  constructor(
    private partService: PartService,
    private manufacturingService: ManufacturingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

onPartSelected(part: Part) {
  this.selectedPart = part; // Set the selected part when a user selects a part
  console.log('Part selected:', this.selectedPart); // Log to ensure part selection works
}

ngOnInit() {
  // Listen for changes from the manufacturing update form
  if (this.manufacturingupdateformComponent) {
    this.manufacturingupdateformComponent.Manu_changesMade.subscribe(changed => {
      this.onManufacturingFieldChange(changed);
    });
  }
}

  // ngOnChanges to detect changes in selectedPart
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPart']) {
      console.log('Selected part:', this.selectedPart); // Log selected part to check if it's passed correctly
      if (this.selectedPart && this.selectedPart.partId) {
        this.fetchManufacturingDetails(this.selectedPart.partId);
      } else {
        console.log('No part selected.');
        this.manufacturings = []; // Reset manufacturing details if no part is selected
      }
    }
  }

  // Method to fetch manufacturing details based on selected part
  fetchManufacturingDetails(partId: number) {
    console.log('Loading manufacturing data for partId:', partId);
    this.partService.getPartById(partId.toString()).subscribe(
      (part: Part) => {
        // Assuming the manufacturing details are stored under the materials property.
        this.manufacturings = part.manufacturings.$values;
        
        // Automatically select the first manufacturing item for editing if available
        if (this.manufacturings.length > 0) {
          this.onEditManufacturing(this.manufacturings[0]); // Activate edit for the first row
        }
      },
      (error) => {
        console.error('Error fetching manufacturing data:', error);
      }
    );
  }

  // Method to add an empty manufacturing entry
  addProcess(event: MouseEvent) {
    // Prevent the default anchor behavior
    event.preventDefault();
  
    if (this.selectedPart && this.selectedPart.partId) {
      // Create a new empty manufacturing entry
      const newManufacturing: Manufacturing = {
        manufacturingId: 0, // Set initial value to 0, server generates the real ID
        processType: '',
        machineDetails: '',
        machineDescription: '',
        cost: 0,
        subprocessType: '',
        machineName: '',
        mcAutomation: '',
        machineEfficiency: '',
        toolingCost: 0,
        loadingTime: 0,
        partId: this.selectedPart.partId // Set partId for the new manufacturing process
      };
  
      // Save the new process to the backend
      this.manufacturingService.addManufacturing(this.selectedPart.partId, newManufacturing).subscribe(
        (response: number) => {  // Expect response to be the new manufacturing ID
          console.log('Manufacturing added successfully with ID:', response);
  
          // Add the new manufacturing object to the local array, updating the ID from the response
          this.manufacturings.push({ ...newManufacturing, manufacturingId: response });
  
          // Show snackbar notification at top right
          this.snackBar.open('Added Process Successfully!', 'Close', {
            duration: 3000,
            horizontalPosition: 'end', // Right
            verticalPosition: 'top' // Top
          });
        },
        (error) => {
          console.error('Error adding new manufacturing:', error);
          this.snackBar.open('Error adding new process.', 'Close', {
            duration: 3000,
            horizontalPosition: 'end', // Right
            verticalPosition: 'top' // Top
          });
        }
      );
    } else {
      this.snackBar.open('No part selected to add the process.', 'Close', {
        duration: 3000,
        horizontalPosition: 'end', // Right
        verticalPosition: 'top' // Top
      });
    }
  }
   

  // Method to delete a manufacturing item
  deleteManufacturing(manufacturingId: number) {
    // Check if manufacturingId is undefined
    if (manufacturingId === undefined) {
      console.error('No manufacturing record selected for deletion.');
      return; // Exit the method if there is no manufacturing record
    }

    // Open the confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this manufacturing record?' }
    });

    // Handle the dialog close event
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Call the service to delete the manufacturing entry
        this.manufacturingService.deleteManufacturing(this.selectedPart?.partId || 0, manufacturingId)
          .subscribe(
            response => {
              console.log('Deleted manufacturing with id:', manufacturingId);
              // Remove the deleted manufacturing from the manufacturings array
              this.manufacturings = this.manufacturings?.filter(
                manufacturing => manufacturing.manufacturingId !== manufacturingId
              ) || [];

              // Show a success toast message
              this.snackBar.open('Deleted successfully', 'Close', {
                duration: 5000, // Toast will display for 5 seconds
                verticalPosition: 'top', // Position the toast at the top
                horizontalPosition: 'right' // Position the toast to the right
              });
            },
            error => {
              console.error('Error deleting manufacturing:', error);
            }
          );
      }
    });
  }

  // Method to select the manufacturing item for editing
  onEditManufacturing(manufacturing: Manufacturing) {
    this.selectedManufacturing = { ...manufacturing, partId: this.selectedPart?.partId ?? 0 }; // Ensure partId is passed
    if(this.selectedManufacturing)
    delete this.selectedManufacturing.part;
    console.log(this.selectedManufacturing);
  }

  // Method to update manufacturing details after the form submission
  onManufacturingUpdate(updatedManufacturing: Manufacturing): void {
    const index = this.manufacturings.findIndex(
      (m) => m.manufacturingId === updatedManufacturing.manufacturingId
    );
    if (index !== -1) {
      this.manufacturings[index] = { ...updatedManufacturing }; // Update the table data immediately
    }
  }
  

  updateAndSave() {
    // Handle save logic here
    if (this.manufacturingupdateformComponent) {
      this.manufacturingupdateformComponent.onSubmit();
    }
  }
  
}
