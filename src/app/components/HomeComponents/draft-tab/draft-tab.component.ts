import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../core/Services/project.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/Interfaces/project.interface';
import { SharedDataService } from '../../../core/Services/shared-data.service';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-draft-tab',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule],
  templateUrl: './draft-tab.component.html',
  styleUrls: ['./draft-tab.component.css']
})
export class DraftTabComponent implements OnInit {
  projects: Project[] = [];

  constructor(
    private projectService: ProjectService, 
    private sharedDataService: SharedDataService, 
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.sharedDataService.projectAdded$.subscribe(() => {
      this.loadProjects();
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((response: any) => {
      if (response.$values && Array.isArray(response.$values)) {
        this.projects = response.$values.map((project: any) => ({
          projectId: project.projectId,
          projectName: project.projectName,
          projectDescription: project.projectDescription,
          createdDate: new Date(project.projectCreatedDate),
          parts: project.parts?.$values.map((part: any) => ({
            partId: part.partId,
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
            lifetimeQuantityRemaining: part.lifetimeQuantityRemaining,
            manufacturings: part.manufacturings?.$values || []
          })) || []
        }));
      } else {
        console.error('Unexpected API response format:', response);
      }
    }, error => {
      console.error('Error loading projects:', error);
    });
  }

  editProject(project: Project): void {
    // Navigate to Costing Page and pass the selected project ID via route
    this.router.navigate(['/costing'], { queryParams: { projectId: project.projectId } });
  }
}
