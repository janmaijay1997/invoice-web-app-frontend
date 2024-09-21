import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'] 
})
export class PagesComponent  {

  constructor() { }

  ngOnInit(): void {
  }

  sidebarclose:boolean = false

  toggleSidebar(){
    this.sidebarclose = !this.sidebarclose
  }

}
