import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { InvoiceService } from 'src/app/services/invoice.service';
import { InvoiceDataService } from 'src/app/services/invoicedataservice';
import { SidebarService } from 'src/app/services/sidebar.service';
import { extractRolesFromToken, getLoginUserEmail } from 'src/app/utils/jwt-util';
import Swal from 'sweetalert2';




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
    private invoiceDataService: InvoiceDataService) { }

  invoiceList: Invoice[] = [];
  isAdmin: any;
  sidebarActive: boolean = true;
  filterValue: string = "";
  ngOnInit() {
    // Subscribe to the sidebar active state
    console.log(localStorage.getItem("lastname"));
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
    });
    this.getInvoiceList();
    this.filterInvoice();
  } users: any = [];

  editInvoice(val: any) {

  }


  viewInvoice(invoiceId: string) {
    const userRoles = extractRolesFromToken();
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
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, cancel!',
  }).then((result) => {
    if (result.isConfirmed) {
      // If the user confirms, call the delete API
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
  });
}



  trimDate(dateString: string): string {
    return dateString.split('T')[0]; // Split by 'T' and return the date part
  }

  getInvoiceList() {
    const userRoles = extractRolesFromToken();
    if (userRoles[0] === 'USER') {
      var createdBy = getLoginUserEmail();
      this.invoiceService.getInvoiceListOfParticularUser(createdBy).subscribe(
        (response: any) => {
          this.invoiceList = response || [];
          this.filteredInvoices = [...this.invoiceList]; // Set filteredInvoices to all invoices
        },
        (error: any) => {
          console.error('Error fetching details:', error);
          this.toastr.error('Something went wrong.', 'Error');
        }
      );

    } else {
      this.invoiceService.getInvoiceList().subscribe(
        (response: any) => {
          this.invoiceList = response || [];
          this.filteredInvoices = [...this.invoiceList]; // Set filteredInvoices to all invoices
        },
        (error: any) => {
          console.error('Error fetching details:', error);
          this.toastr.error('Something went wrong.', 'Error');
        }
      );
    }

  }

  filter = {
    invoiceNumber: '',
    invoiceDate: '',
    vendorName: '',
    amount: '',
    submitter: '',
    status: ''
  };
  filteredInvoices: Invoice[] = []; // <-- Add this line
  dropdownValues: string[] = ['PENDING', 'SUBMITTED', 'REJECTED']; // Sample status values
  selectedStatus: string = 'All'; // Set default to 'ALL'


  filterInvoice() {
    this.filteredInvoices = this.invoiceList.filter(invoice => {
      return (
        (this.filter.invoiceNumber ? invoice.invoiceNumber.includes(this.filter.invoiceNumber) : true) &&
        (this.filter.invoiceDate ? this.trimDate(invoice.invoiceCreatedDate).includes(this.filter.invoiceDate) : true) &&
        (this.filter.vendorName ? invoice.vendorDetails.billTo.includes(this.filter.vendorName) : true) &&
        (this.filter.amount ? invoice.total.grandTotal.toString().includes(this.filter.amount) : true) &&
        (this.filter.submitter ? invoice.submitter.name.includes(this.filter.submitter) : true) &&
        (this.selectedStatus === 'All' || invoice.invoiceStatus === this.selectedStatus)
      );
    });
  }


  downloadPdf(invoiceId: any) {
    this.invoiceService.generatePdf(invoiceId).subscribe((base64Pdf: any) => {
      const pdfDataUrl = 'data:application/pdf;base64,' + base64Pdf.pdfData;

      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = invoiceId + '.pdf';  // File name for download
      link.click();
    });
  }
}
