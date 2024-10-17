import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private projectAddedSource = new Subject<void>();

  projectAdded$ = this.projectAddedSource.asObservable();

  notifyProjectAdded() {
    this.projectAddedSource.next();
  }
}
