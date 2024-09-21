import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  constructor(private sidebarService: SidebarService) { }

  sidebarActive: boolean = true;
  ngOnInit() {
    // Subscribe to the sidebar active state
    console.log(localStorage.getItem("lastname"));
    let flage = localStorage.getItem("lastname");


    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state, "dd");


      // else {
      //   this.sidebarActive = false;
      // }
    });

  } users: any = [];
  invoices: any = []
  isAdmin: any;
  editInvoice(val: any) {

  }
  viewInvoice(val: any) {

  }
}
