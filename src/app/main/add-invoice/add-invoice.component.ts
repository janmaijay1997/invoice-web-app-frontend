import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {
  

  constructor(private sidebarService: SidebarService) { }

  sidebarActive: boolean = false;
  ngOnInit() {
    // Subscribe to the sidebar active state
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      this.sidebarActive = !state;
      if (flage) {
        this.sidebarActive = true;
      }
    });

  } users: any = [];

}
