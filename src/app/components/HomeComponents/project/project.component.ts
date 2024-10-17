import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview';
import { DraftTabComponent } from '../draft-tab/draft-tab.component';
import { ProjectService } from '../../../core/Services/project.service';
import { Project } from '../../../core/Interfaces/project.interface';
import { Part } from '../../../core/Interfaces/Part.interface';
import { SharedDataService } from '../../../core/Services/shared-data.service';

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [FormsModule, CommonModule, TabViewModule, DraftTabComponent],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projectName: string = '';
  projectDescription: string = '';
  files: File[] = [];
  displaySnackbar: boolean = false;
  snackbarMessage: string = '';
  activeTab: number = 0;
  isDragging: boolean = false; // To manage drag state
  selectedTab : string = 'create'

  constructor(private projectService: ProjectService, private router: Router, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {
    // Retrieve the selected tab from local storage
    const storedTab = localStorage.getItem('selectedTab');
    if (storedTab === 'draft') {
      this.activeTab = 1; // Set to Draft tab
      this.selectedTab = 'draft';
    } else {
      this.activeTab = 0; // Default to Create tab
      this.selectedTab = 'create';
    }
  }

  selectedFileName: string | null = null; // Add this property

onDragOver(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = true;
  console.log('Dragging1 :', this.isDragging);
}

onDragLeave(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;
  console.log('Dragging2 :', this.isDragging);
}

onDrop(event: DragEvent): void {
  event.preventDefault();
  this.isDragging = false;
  console.log('Dragging3 :', this.isDragging);

  const fileList = event.dataTransfer?.files;
  if (fileList && fileList.length > 0) {
    const file = fileList[0];
    this.selectedFileName = file.name; // Set the selected file name
    this.handleFile(file);
  }
}

triggerFileInput(): void {
  const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
  if (fileInput) {
    fileInput.click(); // Trigger the hidden file input click
  }
}

onFileSelected(event: any): void {
  const fileList = event.target.files;
  if (fileList && fileList.length > 0) {
    const file = fileList[0];
    this.selectedFileName = file.name; // Set the selected file name
    this.handleFile(file);
  }
}

handleFile(file: File): void {
  if (file.type !== 'application/json') {
    this.showSnackbar('Please upload a valid JSON file');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e: any) => {
    try {
      const jsonData = JSON.parse(e.target.result);
      this.files = [file];
      console.log('Valid JSON:', jsonData);
    } catch (error) {
      this.showSnackbar('Invalid JSON format');
    }
  };

  reader.readAsText(file);
}


  saveToDraft(): void {
    if (!this.projectName || !this.files.length) {
      this.showSnackbar('Fill the Required Fields');
      return;
    }

    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        const parts: Part[] = jsonData.parts.map((part: any) => ({
          partId: part.partId || 0,
          internalPartNumber: part.internalPartNumber,
          supplierName: part.supplierName,
          deliverySiteName: part.deliverySiteName,
          drawingNumber: part.drawingNumber,
          incoTerms: part.incoTerms,
          annualVolume: part.annualVolume,
          bomQty: part.bomQty,
          deliveryFrequency: part.deliveryFrequency,
          lotSize: part.lotSize,
          manufacturingCategory: part.manufacturingCategory,
          packagingType: part.packagingType,
          productLifeRemaining: part.productLifeRemaining,
          paymentTerms: part.paymentTerms,
          partComplexity: part.partComplexity,
          lifetimeQuantityRemaining: part.lifetimeQuantityRemaining,
          manufacturings: part.manufacturings || { $values: [] }
        }));

        const project: Project = {
          projectName: this.projectName,
          projectDescription: this.projectDescription,
          createdDate: new Date(),
          parts: parts
        };

        this.projectService.createProject(project).subscribe(
          response => {
            console.log('Project saved successfully:', response);
            this.showSnackbar('Project Created successfully');
            this.resetForm();
            this.sharedDataService.notifyProjectAdded();
            this.activeTab = 1;
            this.router.navigateByUrl('/home/drafts', { skipLocationChange: true });
          },
          error => {
            console.error('Error saving project:', error);
          }
        );
      } catch (error) {
        this.showSnackbar('Invalid JSON format');
      }
    };

    reader.readAsText(file);
  }

  showSnackbar(message: string): void {
    this.snackbarMessage = message;
    this.displaySnackbar = true;
    setTimeout(() => {
      this.displaySnackbar = false; // Hide snackbar after 3 seconds
    }, 3000);
  }

  resetForm(): void {
    this.projectName = '';
    this.projectDescription = '';
    this.files = [];
    console.log('Form reset');
  }

  discardChanges(): void {
    this.resetForm();
    console.log('Changes discarded');
  }

  selectTab(tab: string) {
    console.log(`Selected tab: ${tab}`);
    this.selectedTab = tab; // Set the currently selected tab
    localStorage.setItem('selectedTab', tab); // Store it in local storage
    this.activeTab = tab === 'draft' ? 1 : 0; // Set the active tab index based on selection
  }
}
