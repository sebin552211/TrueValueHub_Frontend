import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { Part } from '../../../core/Interfaces/Part.interface';
import { PartService } from '../../../core/Services/part.service';
import { CommonModule } from '@angular/common';
import { Project } from '../../../core/Interfaces/project.interface';
import { ProjectService } from '../../../core/Services/project.service';
declare var $: any; // To use jQuery

@Component({
  selector: 'app-side-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-panel.component.html',
  styleUrls: ['./side-panel.component.css'],
})
export class SidePanelComponent implements OnChanges, AfterViewInit {
  searchTerm: string = '';
  filteredProjects: any[] = [];
  selectedPart: Part | null = null;

  @Output() partSelected = new EventEmitter<Part>();

  @Input() selectedProject: any | null = null; // Accept selected project as input

  @Output() searchedProjectId = new EventEmitter<any>();

  constructor(
    private partService: PartService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
  }

  ngOnChanges(): void {
    // Load the project data on component init
    this.initializeJsTree(); // Re-initialize the tree with the project data
    console.log(this.selectedProject);
    this.searchTerm = this.selectedProject.projectName

  }

  ngAfterViewInit(): void {
    this.initializeJsTree();
  }

  initializeJsTree(): void {
    console.log(this.selectedProject);
    // If the selectedProject or its parts are not yet loaded, skip initialization
    if (this.selectedProject) {
      const parts = this.selectedProject.parts.$values.map((part: Part) => ({
        id: part.partId,
        text: part.internalPartNumber,
      }));
      const treeData = [
        {
          id: this.selectedProject.projectId,
          text: this.selectedProject.projectName,
          children: this.selectedProject.parts.$values.map((part: Part) => ({
            id: part.partId,
            text: part.internalPartNumber,
          })),
        },
      ];
      console.log(treeData);

      if ($('#projectTree').jstree(true)) {
        $('#projectTree').jstree(true).destroy();
      }
      $('#projectTree').jstree({
        core: {
          data: treeData,
        },
        plugins: ['checkbox'], // Enable checkbox plugin
        checkbox: {
          keep_selected_style: true, // Optional: To manage selected style via CSS
          three_state: true, // If true, parents get selected if children are selected
          cascade: 'undetermined', // Manage checkbox behavior for parent-child relations
        },
        state: {
          opened: true, // Keep the tree opened
        },
      });

      if (parts.length > 0) {
        $('#projectTree').jstree('select_node', parts[0].id);
      }
    }
  }

  // Method that triggers as the user types in the search bar
    onSearchChange(event: Event) {
      const input = event.target as HTMLInputElement;
      this.searchTerm = input.value.trim(); // Trim whitespace
    
      if (this.searchTerm) {
        // Fetch projects dynamically by search term
        this.projectService.getProjectsByName(this.searchTerm).subscribe(
          (projects:any) => {
            console.log('Projects fetched:', projects); // Log projects to verify data
            this.filteredProjects = projects.$values; // Update the filtered list
            console.log('Filtered Projects:', this.filteredProjects);
            console.log(projects);
          },
          (error) => {
            console.error('Error fetching projects:', error);
            this.filteredProjects = []; // Clear dropdown on error
          }
        );
      } else {
        this.filteredProjects = []; // Clear filtered projects if no search term
      }
    }
  

  // Method to select a project from the dropdown
  selectProject(project: any) {
    this.searchTerm = project.projectName; // Set search input to the selected project name
    console.log(this.filteredProjects);
    this.searchedProjectId.emit(project.projectId);
    const firstPart = this.filteredProjects[0].parts.$values[0]
    this.filteredProjects = []

    if (firstPart) {
      this.selectedPart = firstPart;
      console.log('Emitting selected part:', firstPart); // Check if this logs
      this.partSelected.emit(firstPart);
    } else {
      console.log('No parts found for the selected project.'); // Log if no parts exist
    }
  }

  // Method to get parts for the selected project (if needed)
  getParts(): Part[] {
    return this.selectedProject?.parts || []; // Handle missing parts gracefully
  }
  
}
