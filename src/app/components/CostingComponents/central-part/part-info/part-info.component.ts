import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Part } from '../../../../core/Interfaces/Part.interface';
import { PartService } from '../../../../core/Services/part.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ErrorTooltipComponent } from '../../../../ui/error-tooltip/error-tooltip.component';
import { Project } from '../../../../core/Interfaces/project.interface';
import { ProjectService } from '../../../../core/Services/project.service';

@Component({
  selector: 'app-part-info',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,MatTooltip,ErrorTooltipComponent],
  templateUrl: './part-info.component.html',
  styleUrls: ['./part-info.component.css']
})
export class PartInfoComponent implements OnInit {
  @Input() selectedPart: Part | null = null; // Accept Part or null
  @Input() selectedProject: any | null = null;
  @Input() searchedProjectId: any | null = null;
  partForm!: FormGroup;

  constructor(private fb: FormBuilder, private partService: PartService, private snackBar: MatSnackBar) {}

  @Output() changesMade = new EventEmitter<boolean>();
  private isChanged: boolean = false;

  // Call this method whenever a form field is changed
  onFieldChange() {
    this.isChanged = true;
    this.changesMade.emit(this.isChanged);
    this.recalculateFields();
  }

  recalculateFields(): void {
    const annualVolume = this.partForm.get('annualVolume')?.value;
    const lotSize = this.partForm.get('lotSize')?.value;
    const productLifeRemaining = this.partForm.get('productLifeRemaining')?.value;
  
    if (annualVolume !== null) {
      // Calculate lotSize if it's not set
      if (lotSize !== null) {
        const calculatedLotSize = (annualVolume / 12).toFixed(4);
      this.partForm.patchValue({ lotSize: parseFloat(calculatedLotSize) });
      }
  
      // Calculate productLifeRemaining if it's not set
      if (productLifeRemaining !== null) {
        const calculatedProductLifeRemaining = ((annualVolume * (this.partForm.get('lotSize')?.value || 0)) / 3600).toFixed(4);
      this.partForm.patchValue({ productLifeRemaining: parseFloat(calculatedProductLifeRemaining) });
      }
  
      // Calculate lifeTimeQuantityRemaining based on annualVolume and productLifeRemaining
      const calculatedLifeTimeQuantityRemaining = (annualVolume + (this.partForm.get('productLifeRemaining')?.value || 0)).toFixed(4);
    this.partForm.patchValue({ lifeTimeQuantityRemaining: parseFloat(calculatedLifeTimeQuantityRemaining) });
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    if(this.selectedPart){
      this.populateForm(this.selectedPart);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedPart'] && this.selectedPart) {
      if (this.partForm) {
        this.populateForm(this.selectedPart);
        console.log(this.selectedPart);
      }
    }
    console.log(this.selectedProject)
  }

  initializeForm(): void {
    this.partForm = this.fb.group({
      internalPartNumber: [{ value: '', disabled: true }, Validators.required],
      supplierName: ['', Validators.required],
      deliverySiteName: ['', Validators.required],
      drawingNumber: ['', Validators.required],
      incoTerms: ['', Validators.required],
      annualVolume: ['', Validators.required],
      bomQty: ['', Validators.required],
      deliveryFrequency: ['', Validators.required],
      lotSize: ['', Validators.required],
      partComplexity: ['', Validators.required],
      packagingType: ['', Validators.required],
      productLifeRemaining: ['', Validators.required],
      paymentTerms: ['', Validators.required],
      lifeTimeQuantityRemaining: ['', Validators.required],
      manufacturingCategory: ['', Validators.required]
    });
  }

  populateForm(part: Part): void {
    console.log(this.selectedPart)
    if (this.partForm && part) {
      this.partForm.patchValue({
        internalPartNumber: part.internalPartNumber || '',
        supplierName: part.supplierName || '',
        deliverySiteName: part.deliverySiteName || '',
        drawingNumber: part.drawingNumber || '',
        incoTerms: part.incoTerms || '',
        annualVolume: part.annualVolume || '',
        bomQty: part.bomQty || '',
        deliveryFrequency: part.deliveryFrequency || '',
        lotSize: part.lotSize || '',
        partComplexity: part.partComplexity || 'Low', // Default to 'Low'
        packagingType: part.packagingType || '',
        productLifeRemaining: part.productLifeRemaining || '',
        paymentTerms: part.paymentTerms || '',
        lifeTimeQuantityRemaining: part.lifetimeQuantityRemaining || '',
        manufacturingCategory: part.manufacturingCategory || '',
      });
    }
  }

  onUpdate() {
    if (this.partForm.invalid) {
      // Mark all fields as touched to trigger validation messages
      this.partForm.markAllAsTouched();
      
      // Show the snackbar with the error message
      this.snackBar.open('Form is invalid. Please fill in all required fields.', 'Close', {
        duration: 3000, // Duration the snackbar is shown
        verticalPosition: 'top', // Position it at the top
        horizontalPosition: 'right', // Align to the right
        panelClass: ['snackbar-error'] // Add custom class for styling
      });
  
      console.error('Form is invalid. Please fill in all required fields.');
      return; // Prevent submission if the form is invalid
    }
  
    // If the form is valid, proceed with the update
    this.partForm.get('internalPartNumber')?.enable(); // Enable the control to include it in raw values
    const updatedPart: any = this.partForm.getRawValue(); // Get form values including disabled fields
    const internalPartNumber = updatedPart.internalPartNumber;
    if (this.selectedProject && this.selectedProject.projectId != null) {
      updatedPart.projectId = this.selectedProject.projectId;
  } else {
      updatedPart.projectId = this.searchedProjectId;
  }
  

    console.log('Updated Part:', updatedPart); // Log the updated part details
  
    this.partService.updatePart(internalPartNumber, updatedPart).subscribe({
      next: (response) => {
        console.log('Update successful:', response);
  
        // Show a success snackbar message
        this.snackBar.open('Updated Successfully', 'Close', {
          duration: 5000, // Duration the snackbar is shown
          verticalPosition: 'top', // Position it at the top
          horizontalPosition: 'right', // Align to the right
          panelClass: ['snackbar-success'] // Add custom class for styling
        });
  
        this.partForm.get('internalPartNumber')?.disable();
        this.isChanged = false; // Reset after saving
        this.changesMade.emit(this.isChanged);
      },
      error: (error) => {
        console.error('Update failed:', error);
      }
    });
  }
  
}
