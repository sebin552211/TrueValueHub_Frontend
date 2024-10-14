import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Import Router
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
  description: string = '';
  files: File[] = [];
  displaySnackbar: boolean = false; // Snackbar visibility
  snackbarMessage: string = ''; // Snackbar message
  activeTab: number = 0; // Active tab index

  constructor(private projectService: ProjectService, private router: Router, private sharedDataService: SharedDataService) {}

  ngOnInit(): void {}

  onFileSelected(event: any): void {
    this.files = event.target.files;
  }

  saveToDraft(): void {
    if (!this.projectName || !this.files.length) {
      this.showSnackbar('Fill the Required Fields');
      return;
    }
  
    const file = this.files[0];
    const reader = new FileReader();
  
    reader.onload = (e: any) => {
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
        projectDescription: this.description,
        createdDate: new Date(),
        parts: parts
      };
  
      this.projectService.createProject(project).subscribe(
        response => {
          console.log('Project saved successfully:', response);
          this.showSnackbar('Project Created successfully');
          this.resetForm();
  
          // Notify the DraftTabComponent that a new project was added
          this.sharedDataService.notifyProjectAdded();
  
          this.activeTab = 1; // Set active tab to Draft
          this.router.navigateByUrl('/home/drafts', { skipLocationChange: true });
        },
        error => {
          console.error('Error saving project:', error);
        }
      );
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
    this.description = '';
    this.files = [];
    console.log('Form reset');
  }

  discardChanges(): void {
    this.resetForm();
    console.log('Changes discarded');
  }
}
