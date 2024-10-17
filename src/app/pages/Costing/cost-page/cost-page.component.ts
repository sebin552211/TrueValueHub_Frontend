import { Component, OnInit } from '@angular/core';
import { SidePanelComponent } from '../../../components/CostingComponents/side-panel/side-panel.component';
import { NavbarComponent } from "../../../components/nav-bar/navbar.component";
import { ItemListComponent } from '../../../components/CostingComponents/central-part/item-list/item-list.component';
import { CostSummaryComponent } from '../../../components/CostingComponents/cost-summary/cost-summary.component';
import { Part, ProjectResponse } from '../../../core/Interfaces/Part.interface';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../core/Services/project.service';
import { Project } from '../../../core/Interfaces/project.interface';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-cost-page',
  standalone: true,
  imports: [SidePanelComponent, NavbarComponent, ItemListComponent, CostSummaryComponent],
  templateUrl: './cost-page.component.html',
  styleUrls: ['./cost-page.component.css'],
})
export class CostPageComponent implements OnInit {
  selectedProject: any | null = null;
  selectedPart: Part | null = null; // Use Part type for selectedPart
  newPart: Part[] = []; // Initialize as an array
  parts: Part[] = [];

  searchedProjectId : any | null = null

  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService // To fetch project data
  ) {}

  ngOnInit(): void {
    console.log('CostPageComponent initialized');
    this.route.queryParams.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId) {
        this.loadProject(projectId);
      } else {
        console.log('No projectId found in query parameters');
      }
    });
  }
  
  loadProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe((data:any) => {
      this.parts = data.parts?.$values; // Adjust according to your actual data structure
      console.log(this.parts[0]);
      this.selectedPart = this.parts[0];
      console.log(data.projectName);
      this.selectedProject = data;  
      console.log(this.selectedProject);
      
    });
    
}


  onPartSelected(part: Part): void {
    this.selectedPart = part; // Update selectedPart when a part is selected
    console.log('Selected part:', this.selectedPart);
  }

  onProjectIdSelected(projectId: any): void {
    console.log(projectId);
    this.searchedProjectId = projectId
   }
}
