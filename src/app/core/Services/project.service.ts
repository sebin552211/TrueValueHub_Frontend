import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../Interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7110/api/Project'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  createProject(projectData: Project): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl);
  }

  // Add the getProjectById method
  getProjectById(projectId: number): Observable<Project> {
    const url = `${this.apiUrl}/${projectId}`;  // Add projectId as a route parameter
    return this.http.get<Project>(url);
  }
}
