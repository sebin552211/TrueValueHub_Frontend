import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProjectInterface } from '../Interfaces/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private apiUrl = 'your-api-url-here'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  getProjects(): Observable<ProjectInterface[]> {
    return this.http.get<ProjectInterface[]>(this.apiUrl);
  }
}
