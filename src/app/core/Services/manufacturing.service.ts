import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manufacturing } from '../../core/Interfaces/Manufacturing.interface';

@Injectable({
  providedIn: 'root'
})
export class ManufacturingService {

  private apiUrl = 'https://localhost:7110/api/Part'; // Base URL for parts

  constructor(private http: HttpClient) { }

  // Update manufacturing details
  updateManufacturing(partId: number, manufacturingId: number, manufacturing: Manufacturing): Observable<any> {
    manufacturing.partId = partId;
    console.log('Updating manufacturing:', manufacturing);
    return this.http.put(`${this.apiUrl}/${partId}/manufacturings/${manufacturingId}`, manufacturing, {
      responseType: 'text' as 'json'
    });
  }

  // Delete manufacturing
  deleteManufacturing(partId: number, manufacturingId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${partId}/manufacturings/${manufacturingId}`, {
      responseType: 'text' as 'json'
    });
  }

  // Fetch manufacturing by partId (optional)
  getManufacturingsByPartId(partId: number): Observable<Manufacturing[]> {
    return this.http.get<Manufacturing[]>(`${this.apiUrl}/${partId}/manufacturings`);
  }

  // In your ManufacturingService
addManufacturing(partId: number, manufacturing: Manufacturing): Observable<any> {
  manufacturing.partId = partId;
  return this.http.post(`${this.apiUrl}/${partId}/manufacturings`, manufacturing, {
    responseType: 'text' as 'json'
  });
}
}
