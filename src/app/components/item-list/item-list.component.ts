import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Part } from '../../core/Interfaces/Part.interface';
import { PartService } from '../../core/Services/part.service';
import { FormsModule } from '@angular/forms';
import { Manufacturing } from '../../core/Interfaces/Manufacturing.interface';
import { ManufacturingService } from '../../core/Services/manufacturing.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../ui/confirm-dialog/confirm-dialog.component'; // Adjust the path as necessary
import { MatSnackBar } from '@angular/material/snack-bar';


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
interface PartField {
  label: string;
  value: any;
  infoMessage: string;
  disabled?: boolean;
  options?: string[]; 
}

@Component({
  selector: 'app-item-list',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './item-list.component.html',
  styleUrl: './item-list.component.css'
})
export class ItemListComponent {

  newManufacturing: Manufacturing = {
    manufacturingId: 0,
    processType: '',
    subprocessType:'',
    machineDetails:'',
    machineDescription: '',
    cost: 0,
    machineName:'',
    mcAutomation:'',
    machineEfficiency:'',
    toolingCost:0,
    loadingTime:0,
    partId: 0, // Adjust based on your model
  };

  
  @Input() selectedPart: Part | null = null;
  manufacturings: Manufacturing[] = [];
  selectedManufacturing: Manufacturing | null = null;
  
  get processType(): string {
    return this.selectedManufacturing ? this.selectedManufacturing.processType : '';
  }
  
  set processType(value: string) {
    if (this.selectedManufacturing) {
      this.selectedManufacturing.processType = value;
    }
  }

  // Getter and setter for subprocessType
  get subprocessType(): string {
    return this.selectedManufacturing ? this.selectedManufacturing.subprocessType : '';
  }

  set subprocessType(value: string) {
    if (this.selectedManufacturing) {
      this.selectedManufacturing.subprocessType = value;
    }
  }

  // Getter and setter for machineDetails
  get machineDetails(): string {
    return this.selectedManufacturing ? this.selectedManufacturing.machineDetails : '';
  }

  set machineDetails(value: string) {
    if (this.selectedManufacturing) {
      this.selectedManufacturing.machineDetails = value;
    }
  }

  // Getter and setter for machineDescription
  get machineDescription(): string {
    return this.selectedManufacturing ? this.selectedManufacturing.machineDescription : '';
  }

  set machineDescription(value: string) {
    if (this.selectedManufacturing) {
      this.selectedManufacturing.machineDescription = value;
    }
  }

  // Getter and setter for cost
  get cost(): number {
    return this.selectedManufacturing ? this.selectedManufacturing.cost : 0; // Default to 0 if null
  }

  set cost(value: number) {
    if (this.selectedManufacturing) {
      this.selectedManufacturing.cost = value;
    }
  }

  isEditing: boolean = false; // To control form visibility

  hasChanges: boolean = false; // Track editing state
  hasManufacturingChanges = false; // For manufacturing information

  loading = false;

  constructor(private partService: PartService, private manufacturingService: ManufacturingService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  items :AccordionItem[] =  [
    { title: 'Part Information', icon: 'fa fa-file', progress: 100, isExpanded: false,  content: {
        type: 'form',
        data: [
          { label: 'Internal Part Number', value: '', disabled: true ,  infoMessage: 'This is the internal part number for identification.'},
          { label: 'Supplier Name', value: '', options: ['India', 'USA', 'Dubai'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Delivery Site Name', value: '', options: ['India', 'USA', 'Dubai'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Drawing Number', value: '', infoMessage: 'This is the internal part number for identification.' },
          { label: 'Inco Terms', value: '',infoMessage: 'This is the internal part number for identification.' },
          { label: 'Annual Volume(Nos.)', infoMessage: 'This is the internal part number for identification.' },
          { label: 'BOM Qty(Nos.)' , infoMessage: 'This is the internal part number for identification.'},
          { label: 'Delivery Frequency (days)', infoMessage: 'This is the internal part number for identification.' },
          { label: 'Lot size(Nos.)', infoMessage: 'This is the internal part number for identification.'},
          { label: 'Part Complexity', value: '', options: ['Low', 'Medium', 'High'],infoMessage: 'This is the internal part number for identification.' }, // Add Part Complexity with options

          { label: 'Manufacturing Category', value: '', options: ['Casting', 'Molding'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Packaging Type', value: '' , options: ['Reusable Packaging', 'Non-Reusable Packaging'], infoMessage: 'This is the internal part number for identification.'},
          { label: 'Product Life Remaining(Yrs)', infoMessage: 'This is the internal part number for identification.'},
          { label: 'Payment Terms(days)', value: '', options: ['30days', '60days'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Life Time Quantity Remaining(Nos.)', infoMessage: 'This is the internal part number for identification.' },

        ]
      }
    },
    { title: 'Supporting Documents', icon: 'fa fa-file-alt', progress: 100, isExpanded: false, content: {
        type: 'text',
        data: []
        }
    },
    
    {
      title: 'Cost Information',
      icon: 'fa-dollar-sign',
      progress: 80,
      isExpanded: false,
      content: {
        type: 'form',
        data: []
      }
    },
    { title: 'Material Information', icon: 'fa fa-info-circle', progress: 80, isExpanded: false, content: {
      type: 'form',
      data: []
    }},
    { title: 'Manufacturing Information', icon: 'fa fa-industry', progress: 80, isExpanded: false, content: {
      type: 'form',
      data: [this.manufacturings]
    }},
    { title: 'Tooling', icon: 'fa fa-toolbox', progress: 0, isExpanded: false, content: {
      type: 'form',
      data: []
    }},
    { title: 'Secondary Process', icon: 'fa fa-cogs', progress: 0, isExpanded: false,content: {
      type: 'form',
      data: []
    }},
    { title: 'Purchased (Catalogue) Parts Information', icon: 'fa fa-calendar', progress: 0, isExpanded: false, content: {
      type: 'form',
      data: []
    }},
    { title: 'Overhead & Profit', icon: 'fa fa-dollar-sign', progress: 100, isExpanded: false, content: {
      type: 'form',
      data: []
    } },
    { title: 'Packaging', icon: 'fa fa-box', progress: 100, isExpanded: false, content: {
      type: 'form',
      data: []
    } },
    { title: 'Logistics Cost', icon: 'fa fa-truck', progress: 100, isExpanded: false,content: {
      type: 'form',
      data: []
    }},
  ];
  FilteredItems: AccordionItem[] = [];

  ngOnInit() {
    // Initialize FilteredItems with all items
    this.FilteredItems = [...this.items];
  }

  ngOnChanges() {
    if (this.selectedPart && this.selectedPart.partId) {
      this.updatePartInformation(this.selectedPart);
      this.loadManufacturingData(this.selectedPart.partId);
    } else {
      console.warn('Selected part or PartId is undefined');
    }
  }

  loadManufacturingData(partId: number) {
    console.log('Loading manufacturing data for partId:', partId);
    this.partService.getPartById(partId.toString()).subscribe(
      (part: Part) => {
        // Assuming the manufacturing details are stored under the materials property.
        this.manufacturings = part.manufacturings.$values;
      },
      (error) => {
        console.error('Error fetching manufacturing data:', error);
      }
    );
  }

  updatePartInformation(part: Part) {
    if (part.manufacturings && part.manufacturings.$values) {
      // Assign materials directly from $values, ensuring it's an array
      this.manufacturings = part.manufacturings.$values as Manufacturing[]; // Cast to Material[]
  } else {
      this.manufacturings = []; // Default to an empty array if no materials or not structured as expected
  }
    console.log("HII",this.manufacturings);
    const partInfo = this.items.find(item => item.title === 'Part Information');
    if (partInfo && partInfo.content.type === 'form') {
      partInfo.content.data = [
        { label: 'Internal Part Number', value: part.internalPartNumber , disabled: true, infoMessage: 'Internal part number for identification.' },
        { label: 'Supplier Name', value: part.supplierName , options: ['India', 'USA', 'Dubai'], infoMessage: 'Supplier information.' },
        { label: 'Delivery Site Name', value: part.deliverySiteName, options: ['India', 'USA', 'Dubai'], infoMessage: 'Delivery site details.' },
        { label: 'Drawing Number', value: part.drawingNumber , infoMessage: 'Drawing details.' },
        { label: 'Inco Terms', value: part.incoTerms,infoMessage: 'This is the internal part number for identification.' },
          { label: 'Annual Volume(Nos.)', value: part.annualVolume,infoMessage: 'This is the internal part number for identification.' },
          { label: 'BOM Qty(Nos.)', value: part.bomQty , infoMessage: 'This is the internal part number for identification.'},
          { label: 'Delivery Frequency (days)', value: part.deliveryFrequency, infoMessage: 'This is the internal part number for identification.' },
          { label: 'Lot size(Nos.)', value: part.lotSize , infoMessage: 'This is the internal part number for identification.'},
          { label: 'Part Complexity', value:'', options: ['Low', 'Medium', 'High'],infoMessage: 'This is the internal part number for identification.' }, // Add Part Complexity with options

          { label: 'Manufacturing Category', value: part.manufacturingCategory, options: ['Casting', 'Molding'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Packaging Type', value: part.packagingType ,options: ['Reusable Packaging', 'Non-Reusable Packaging'], infoMessage: 'This is the internal part number for identification.'},
          { label: 'Product Life Remaining(Yrs)', value: part.productLifeRemaining ,infoMessage: 'This is the internal part number for identification.'},
          { label: 'Payment Terms(days)', value: part.paymentTerms, options: ['30days', '60days'], infoMessage: 'This is the internal part number for identification.' },
          { label: 'Life Time Quantity Remaining(Nos.)', value: part.lifetimeQuantityRemaining,infoMessage: 'This is the internal part number for identification.' },

      ];
    }
  }

  toggleItem(item: { isExpanded: boolean; }) {
    item.isExpanded = !item.isExpanded;
  }

  expandAll() {
    this.items.forEach(item => item.isExpanded = true);
  }

  collapseAll() {
    this.items.forEach(item => item.isExpanded = false);
  }  
  isIterable(data: any): boolean {
    return Array.isArray(data) && data.length > 0 && data !== null && data !== undefined;
  }

  showInfo(message: string) {
    alert(message);
  }
  updateAndSave() {
    const partInfo = this.items.find(item => item.title === 'Part Information');

    if (partInfo && partInfo.content.type === 'form') {
      const updatedPart: any = {
        internalPartNumber: partInfo.content.data.find((field: PartField) => field.label === 'Internal Part Number').value,
        supplierName: partInfo.content.data.find((field: PartField) => field.label === 'Supplier Name').value,
        deliverySiteName: partInfo.content.data.find((field: PartField) => field.label === 'Delivery Site Name').value,
        drawingNumber: partInfo.content.data.find((field: PartField) => field.label === 'Drawing Number').value,
        incoTerms: partInfo.content.data.find((field: PartField) => field.label === 'Inco Terms').value,
        annualVolume: partInfo.content.data.find((field: PartField) => field.label === 'Annual Volume(Nos.)').value,
        bomQty: partInfo.content.data.find((field: PartField) => field.label === 'BOM Qty(Nos.)').value,
        deliveryFrequency: partInfo.content.data.find((field: PartField) => field.label === 'Delivery Frequency (days)').value,
        lotSize: partInfo.content.data.find((field: PartField) => field.label === 'Lot size(Nos.)').value,
        partComplexity: partInfo.content.data.find((field: PartField) => field.label === 'Part Complexity').value,
        manufacturingCategory: partInfo.content.data.find((field: PartField) => field.label === 'Manufacturing Category').value,
        packagingType: partInfo.content.data.find((field: PartField) => field.label === 'Packaging Type').value,
        productLifeRemaining: partInfo.content.data.find((field: PartField) => field.label === 'Product Life Remaining(Yrs)').value,
        paymentTerms: partInfo.content.data.find((field: PartField) => field.label === 'Payment Terms(days)').value,
        lifeTimeQuantityRemaining: partInfo.content.data.find((field: PartField) => field.label === 'Life Time Quantity Remaining(Nos.)').value,
      };

      // Check for empty required fields before proceeding
    const requiredFields = [
      'internalPartNumber',
      'supplierName',
      'deliverySiteName',
      'drawingNumber',
      'incoTerms',
      'annualVolume',
      'bomQty',
      'deliveryFrequency',
      'lotSize',
      'manufacturingCategory',
      'packagingType',
      'productLifeRemaining',
      'paymentTerms',
      'lifeTimeQuantityRemaining',
    ];

    const emptyFields = requiredFields.filter(field => !updatedPart[field]);
    
    if (emptyFields.length > 0) {
      this.snackBar.open(`Please fill in the required fields: ${emptyFields.join(', ')}`, 'Close', {
        duration: 5000,
        verticalPosition: 'top',
        horizontalPosition: 'right'
      });
      return; // Stop further execution if required fields are empty
    }


      console.log(updatedPart);

      // First, update the part information
      this.partService.updatePart(updatedPart.internalPartNumber, updatedPart).subscribe(response => {
        console.log('Part updated successfully', response);
        this.hasChanges = false; // Reset editing state after saving
        this.hasManufacturingChanges = false; // Reset the save button color

        // Show a success toast message for part update
        this.snackBar.open('Updated successfully', 'Close', {
          duration: 5000, // Toast will display for 5 seconds
          verticalPosition: 'top', // Position the toast at the top
          horizontalPosition: 'right' // Position the toast to the right
        });

        // Now handle the manufacturing part
        if (this.selectedManufacturing) {
          console.log('Selected Manufacturing before save:', this.selectedManufacturing);

          // Ensure the partId is present and valid
          if (!this.selectedManufacturing.partId) {
            console.error('partId is missing!');
            return; // Prevent submission if partId is missing
          }

          const updatedManufacturing = {
            ...this.selectedManufacturing,
            part: { id: this.selectedManufacturing.partId }, // Include the part reference
            partId: this.selectedManufacturing.partId // Ensure partId is correct
          };

          // Call the service to update the manufacturing entry
          this.manufacturingService.updateManufacturing(
            updatedManufacturing.partId,
            updatedManufacturing.manufacturingId,
            updatedManufacturing
          ).subscribe(response => {
            console.log('Updated manufacturing details:', response);

            // Find the index of the updated manufacturing in the list
            const index = this.manufacturings.findIndex(m => m.manufacturingId === updatedManufacturing.manufacturingId);
            
            // Replace the old manufacturing data with the updated one in the manufacturings array
            if (index !== -1) {
              this.manufacturings[index] = { ...updatedManufacturing }; // Update the specific entry in the list
            }
            
            this.isEditing = false; // Close the editing form
            this.hasManufacturingChanges = false; // Reset the save button color

            // Show a success toast message for manufacturing update
            this.snackBar.open('Updated successfully', 'Close', {
              duration: 5000, // Toast will display for 5 seconds
              verticalPosition: 'top', // Position the toast at the top
              horizontalPosition: 'right' // Position the toast to the right
            });
          }, error => {
            console.error('Error updating manufacturing:', error);
          });
        } else {
          // If there's no selectedManufacturing, treat this as an add operation
          this.newManufacturing = {
            ...this.newManufacturing,
            partId: this.selectedPart?.partId || 0, // Ensure partId is set from the selected part
          };

          // Check if partId is valid before submitting
          if (this.newManufacturing.partId === 0) {
            console.error('Invalid partId, cannot add manufacturing entry.');
            return;
          }

          // Call the service to add the manufacturing entry
          this.manufacturingService.addManufacturing(this.newManufacturing.partId, this.newManufacturing)
            .subscribe(response => {
              console.log('Added new manufacturing entry:', response);

              // Add the newly added manufacturing to the manufacturings list
              this.manufacturings.push(response);

              // Reset the form after successful addition
              this.resetNewManufacturingForm();
              this.isAddingNewManufacturing = false; // Hide the form after adding the entry
              this.hasManufacturingChanges = false; // Reset the save button color
            }, error => {
              console.error('Error adding new manufacturing:', error);
            });
        }
      });

      this.loading = true; // Show loader

      // Simulate a save process (e.g., an API call)
      setTimeout(() => {
        this.loading = false; // Hide loader once done
      }, 3000); // Replace with actual save logic
    }
  }
  

  // Method to set hasChanges to true
  onFieldChange() {
    this.hasChanges = true;
  }

  // Call this function whenever there's a change in the manufacturing form
  onManufacturingFieldChange() {
    this.hasManufacturingChanges = true;  // Mark manufacturing form as changed
  }


  recalculateCost(){
  }
 
  editManufacturing(manufacturing: Manufacturing) {
    this.selectedManufacturing = { ...manufacturing }; // Clone the object to avoid modifying the original until save
    this.isEditing = true;
    console.log('Editing manufacturing:', this.selectedManufacturing);
  }

  // Delete manufacturing logic
  deleteManufacturing(manufacturingId: number | undefined) {
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
  
  
  resetNewManufacturingForm() {
    this.newManufacturing = {
      manufacturingId: 0,
      processType: '',
      subprocessType:'',
      machineDetails:'',
      machineDescription: '',
      cost: 0,
      machineName:'',
      mcAutomation:'',
      machineEfficiency:'',
      toolingCost:0,
      loadingTime:0,
      partId: 0
    };
  }
  
  
  hideDetails() {
    this.isEditing = false; // Close the edit form
    // Optionally, you can reset any fields if needed
    this.processType = '';
    this.machineDetails = '';
    this.machineDescription = '';
  }  
  
  isAddingNewManufacturing: boolean = false; // Track visibility of the add process form

showAddProcessForm() {
  this.isAddingNewManufacturing = true; // Show the form for adding new manufacturing
}

hideAddProcessForm() {
  this.isAddingNewManufacturing = false; // Hide the add manufacturing form
  // Optionally reset the newManufacturing object
  this.newManufacturing = {
    manufacturingId: 0,
    processType: '',
    subprocessType:'',
    machineDetails:'',
    machineDescription: '',
    cost: 0,
    machineName:'',
    mcAutomation:'',
    machineEfficiency:'',
    toolingCost:0,
    loadingTime:0,
    partId: 0
  };
}

}
