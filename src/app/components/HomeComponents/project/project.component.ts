import { Component, OnInit } from '@angular/core';
import { ProjectInterface } from '../../../core/Interfaces/project.interface';
import { ProjectService } from '../../../core/Services/project.service';
import { TableModule } from 'primeng/table';  // Import TableModule
import { ButtonModule } from 'primeng/button'; // Import ButtonModule
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TabViewModule } from 'primeng/tabview'; // Import TabViewModule

@Component({
  selector: 'app-project',
  standalone: true,
  imports: [TableModule,ButtonModule,FormsModule,CommonModule,TabViewModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.css'
})
export class ProjectComponent implements OnInit {

  projects = [
    {
      projectId: 1,
      projectName: 'Test Project',
      projectDescription: 'This is a test project.',
      createdDate: new Date()
    },
    // Add more project objects as needed
  ];

  // projects: ProjectInterface[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe(data => {
      this.projects = data;
    });
  }

  // To manage the selected tab
  isDraftSelected: boolean = false;

  // You might want to handle tab selection
  onTabChange(event: any) {
    this.isDraftSelected = event.index === 1; // 1 is the index of Draft tab
  }
}
