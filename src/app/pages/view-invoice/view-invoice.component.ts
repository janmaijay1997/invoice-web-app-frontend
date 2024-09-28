import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SidebarService } from 'src/app/services/sidebar.service';



interface Total {
  subTotal: string;
  adjustments: string;
  grandTotal: string;
}

interface Submitter {
  id: string;
  name: string;
}

interface Vendor {
  billTo: string;
  paymentDue: string;
}


interface Invoice {
  invoiceNumber: string;
  invoiceCreatedDate: string;
  vendorDetails: Vendor;
  total: Total;
  submitter: Submitter;
  invoiceStatus: string;
}


@Component({
  selector: 'app-view-invoice',
  templateUrl: './view-invoice.component.html',
  styleUrls: ['./view-invoice.component.scss']
})
export class ViewInvoiceComponent implements OnInit {
  constructor(private sidebarService: SidebarService, private invoiceService: InvoiceService, private toastr: ToastrService) { }

  invoiceList: Invoice[] = [];
  isAdmin: any;
  sidebarActive: boolean = true;
  ngOnInit() {
    // Subscribe to the sidebar active state
    console.log(localStorage.getItem("lastname"));
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
    });
    this.getInvoiceList();
  } users: any = [];

  editInvoice(val: any) {

  }


  viewInvoice(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe(
      (response: any) => {
        this.invoiceList = response.response || []; // Ensure it defaults to an empty array if undefined
        console.log("Invoice List:", this.invoiceList); // Log the invoice list for debugging
      },
      (error: any) => {
        console.error('Error fetching details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }

  trimDate(dateString: string): string {
    return dateString.split('T')[0]; // Split by 'T' and return the date part
  }


  // Method to submit the invoice form
  getInvoiceList() {
    this.invoiceService.getInvoiceList().subscribe(
      (response: any) => {
        // Assign the response data to invoiceList
        this.invoiceList = response.response || []; // Ensure it defaults to an empty array if undefined
        console.log("Invoice List:", this.invoiceList); // Log the invoice list for debugging
      },
      (error: any) => {
        console.error('Error fetching details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }
}
