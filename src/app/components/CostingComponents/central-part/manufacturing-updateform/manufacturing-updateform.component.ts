  import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
  import { Manufacturing } from '../../../../core/Interfaces/Manufacturing.interface';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { CommonModule } from '@angular/common';
  import { FormsModule } from '@angular/forms';
  import { ManufacturingService } from '../../../../core/Services/manufacturing.service';

  @Component({
    selector: 'app-manufacturing-updateform',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './manufacturing-updateform.component.html',
    styleUrls: ['./manufacturing-updateform.component.css']
  })
  export class ManufacturingUpdateformComponent implements OnInit, OnChanges {

    @Input() manufacturing?: Manufacturing; // Input to receive manufacturing data
    @Output() manufacturingUpdated = new EventEmitter<Manufacturing>(); // Output to send updated data back to parent
    hasManufacturingChanges: boolean = false; // Track if there are changes

    constructor(
      private manufacturingService: ManufacturingService, // Inject the service
      private snackBar: MatSnackBar // Inject MatSnackBar
    ) {}

   @Output() Manu_changesMade = new EventEmitter<boolean>();
  private isChanged: boolean = false;

  // Call this method whenever a form field is changed
  // onFieldChange() {
  //   this.isChanged = true;
  //   this.changesMade.emit(this.isChanged);
  // }

    ngOnInit() {
      // Any initialization logic can go here, though it's empty for now
      console.log('ManufacturingUpdateformComponent initialized.');
    }

    ngOnChanges(changes: SimpleChanges) {
      // React to changes in @Input() properties
      if (changes['manufacturing'] && changes['manufacturing'].currentValue) {
        console.log('Manufacturing input changed:', this.manufacturing);
        // Perform any action necessary when the input changes
        this.hasManufacturingChanges = false; // Reset change tracker on input change
      }
    }

    onSubmit(): void {
      if (this.manufacturing) {
        this.manufacturingService.updateManufacturing(this.manufacturing.partId, this.manufacturing.manufacturingId, this.manufacturing)
          .subscribe({
            next: () => {
              this.snackBar.open('Manufacturing details updated successfully!', 'Close', {
                duration: 3000, // Duration the snackbar is shown
                verticalPosition: 'top', // Position it at the top
                horizontalPosition: 'right', // Align to the right
                panelClass: ['snackbar-success'] // Add custom class for styling if needed
              });
              this.hasManufacturingChanges = false;
              this.isChanged = false; // Reset after saving
              this.Manu_changesMade.emit(this.isChanged);
              this.manufacturingUpdated.emit(this.manufacturing); // Emit updated manufacturing back to parent
            },
            error: (err) => {
              this.snackBar.open('Error updating manufacturing details.', 'Close', {
                duration: 3000, // Duration the snackbar is shown
                verticalPosition: 'top', // Position it at the top
                horizontalPosition: 'right', // Align to the right
                panelClass: ['snackbar-error'] // Add custom class for styling if needed
              });
              console.error('Error:', err);
            }
          });
      }
    }

    hideDetails() {
      this.manufacturing = undefined; // Close the edit form
      this.hasManufacturingChanges = false; // Reset change tracker
    }

    onManufacturingFieldChange() {
      this.hasManufacturingChanges = true; // Mark manufacturing form as changed
      this.Manu_changesMade.emit(this.hasManufacturingChanges); // Emit the change status
    }
    
  }
