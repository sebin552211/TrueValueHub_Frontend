import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../core/Services/project.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/Interfaces/project.interface';
import { SharedDataService } from '../../../core/Services/shared-data.service';
import { Router } from '@angular/router';  // Import Router for navigation
import { MatTooltip } from '@angular/material/tooltip';
import { TableLazyLoadEvent } from 'primeng/table'; // Import the correct type

@Component({
  selector: 'app-draft-tab',
  standalone: true,
  imports: [TableModule, ButtonModule, CommonModule, MatTooltip],
  templateUrl: './draft-tab.component.html',
  styleUrls: ['./draft-tab.component.css']
})
export class DraftTabComponent implements OnInit {
  projects: Project[] = [];
  totalRecords: number = 0; // Variable to store total records for pagination
  expandedRows: { [key: string]: boolean } = {}; // Change to an object

  constructor(
    private projectService: ProjectService, 
    private sharedDataService: SharedDataService, 
    private router: Router // Inject Router
  ) {}

  ngOnInit(): void {
    this.loadProjects({ first: 0, rows: 10 }); // Initial load with default pagination
    this.sharedDataService.projectAdded$.subscribe(() => {
      this.loadProjects({ first: 0, rows: 10 }); // Reload projects when a new project is added
    });
  }

  loadProjects(event: TableLazyLoadEvent): void {
    const first = event.first ?? 0;
    const rows = event.rows ?? 10;
    // Ensure sortField is a string or undefined
    const sortField: string | undefined = typeof event.sortField === 'string' ? event.sortField : undefined;

    // Determine sortOrder
    const sortOrder: string | undefined = event.sortOrder === 1 ? 'asc' : event.sortOrder === -1 ? 'desc' : undefined;

    // Log values for debugging
    console.log('Sort Field:', sortField);
    console.log('Sort Order:', sortOrder);

  
    this.projectService.getProjects(first, rows, sortField, sortOrder).subscribe((response: any) => {
      if (response.values && Array.isArray(response.values.$values)) {
        this.projects = response.values.$values.map((project: any) => ({
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
        
        this.totalRecords = response.totalCount;
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
  
  projectPartsExists(project: any): boolean {
    return project.parts && project.parts.length > 0;
  }

  onRowToggle(event: any) {
    const projectId = event.data.projectId; // Assuming projectId is the unique identifier
    this.expandedRows[projectId] = !this.expandedRows[projectId]; // Toggle the row's expanded state
  }
}
