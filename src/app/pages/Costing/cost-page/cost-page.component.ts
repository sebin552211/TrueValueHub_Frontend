import { Component,OnInit } from '@angular/core';
import { SidePanelComponent } from '../../../components/CostingComponents/side-panel/side-panel.component';
import { NavbarComponent } from "../../../components/nav-bar/navbar.component";
import { ItemListComponent } from '../../../components/CostingComponents/central-part/item-list/item-list.component';
import { CostSummaryComponent } from '../../../components/CostingComponents/cost-summary/cost-summary.component';
import { Part } from '../../../core/Interfaces/Part.interface';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../../../core/Services/project.service';
import { Project } from '../../../core/Interfaces/project.interface';

@Component({
  selector: 'app-cost-page',
  standalone: true,
  imports: [SidePanelComponent, NavbarComponent,ItemListComponent, CostSummaryComponent],
  templateUrl: './cost-page.component.html',
  styleUrl: './cost-page.component.css',
  

})
export class CostPageComponent {
  selectedProject: Project | null = null;
  constructor(
    private route: ActivatedRoute,
    private projectService: ProjectService  // To fetch project data
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const projectId = params['projectId'];
      if (projectId) {
        this.loadProject(projectId);
      }
    });
  }

  loadProject(projectId: number): void {
    this.projectService.getProjectById(projectId).subscribe((project: Project) => {
      this.selectedProject = project;
      console.log('Selected Project:', this.selectedProject);  // Ensure parts exist here
    });
  }

  selectedPart: Part | null = null;
  

  onPartSelected(part: Part) {
    this.selectedPart = part;
    console.log('Selected part:', this.selectedPart); 

  }

  
}
