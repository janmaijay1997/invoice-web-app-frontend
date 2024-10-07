import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoiceDataService } from 'src/app/services/invoicedataservice';
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
  constructor(private sidebarService: SidebarService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private router: Router,
    private invoiceDataService:InvoiceDataService) { }

  invoiceList: Invoice[] = [];
  isAdmin: any;
  sidebarActive: boolean = true;
  filterValue:string="";
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
        const invoice = response;
        console.log("Invoice:", invoice);

        // Navigate to the add invoice page and pass the invoice data as state
        this.invoiceDataService.setInvoice(invoice);
        this.router.navigate(['/viewInvoiceDetail'], { queryParams: { invoiceNumber: invoice.invoiceNumber } });

      },
      (error: any) => {
        console.error('Error fetching details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }


  deleteInvoice(invoiceId: string) {
    this.invoiceService.deleteInvoice(invoiceId).subscribe(
      (response: any) => {
       this.toastr.success('Invoice Deleted successfully', 'Success');
      this.getInvoiceList();
    },
      (error: any) => {
        console.error('Error Deleting Invoice:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }


  trimDate(dateString: string): string {
    return dateString.split('T')[0]; // Split by 'T' and return the date part
  }

  getInvoiceList() {
    this.invoiceService.getInvoiceList().subscribe(
      (response: any) => {
        this.invoiceList = response || [];
        console.log("Invoice List:", this.invoiceList);
      },
      (error: any) => {
        console.error('Error fetching details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }
  filterInvoice(){
    if(this.filterValue==null || this.filterValue.trim().length==0){
      this.getInvoiceList();
    }else{
     this.invoiceList= this.invoiceList.filter((invoice=>invoice.invoiceNumber.includes(this.filterValue)));
    }
  }
  downloadPdf(invoiceId:any) {
    this.invoiceService.generatePdf(invoiceId).subscribe((base64Pdf: any) => {
      const pdfDataUrl = 'data:application/pdf;base64,' + base64Pdf.pdfData;

      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = invoiceId+'.pdf';  // File name for download
      link.click();
    });
  }
}
