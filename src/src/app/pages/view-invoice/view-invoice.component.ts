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
  invoices: any = [
    {id:1,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:2,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:3,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:4,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:5,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:6,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:7,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:8,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:9,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:10,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:11,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:12,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:13,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:14,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:15,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:16,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:17,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:18,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:19,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:20,client:'abc',date:'21-09-2024',total:21,status:'active'},
    {id:21,client:'abc',date:'21-09-2024',total:21,status:'active'},
  ]
  isAdmin: any;
  editInvoice(val: any) {

  }
  viewInvoice(val: any) {

  }
}
