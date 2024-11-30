import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private sidebarActiveSubject = new BehaviorSubject<boolean>(true);
  sidebarActive$ = this.sidebarActiveSubject.asObservable(); 
  toggleSidebar() {
    this.sidebarActiveSubject.next(!this.sidebarActiveSubject.value);
  }

  setSidebarActive(state: boolean) {
    this.sidebarActiveSubject.next(state);
  }

  getSidebarActive() {
    return this.sidebarActiveSubject.value;
  }
}
