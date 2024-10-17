import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Project } from '../Interfaces/project.interface';
import { ProjectResponse } from '../Interfaces/Part.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'https://localhost:7110/api/Project'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  createProject(projectData: Project): Observable<any> {
    return this.http.post(this.apiUrl, projectData);
  }

  getProjects(first: number, rows: number, sortField?: string, sortOrder?: string): Observable<{ $values: Project[], totalCount: number }> {
    let params = new HttpParams()
        .set('skip', first.toString())
        .set('take', rows.toString());

    if (sortField) {
        params = params.set('sortField', sortField);
    }

    if (sortOrder) { // Change this to handle string
        params = params.set('sortOrder', sortOrder);
    }

    return this.http.get<{ $values: Project[], totalCount: number }>(this.apiUrl, { params });
}


  // Get project by ID method
  getProjectById(projectId: number): Observable<ProjectResponse> {
    const url = `${this.apiUrl}/${projectId}`;
    return this.http.get<ProjectResponse>(url);
  }

  // New method to fetch projects by name
  getProjectsByName(projectName: string): Observable<Project[]> {
    const url = `${this.apiUrl}/search?name=${encodeURIComponent(projectName)}`;
    return this.http.get<any[]>(url);
  }
}
