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
  totalRecords: number = 0; // Total records for pagination
  invoiceList: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  userRole!: string; // Definite assignment assertion for userRole
  page: number = 0;
  rows: number = 20; // Number of rows per page
  loading: boolean = true;  // To show loading spinner
  filter = {
    invoiceNumber: '',
    vendorName: '',
    status: ''
  };
  selectedStatus: string = 'All'; // Default status
  dropdownValues: string[] = ['PENDING', 'SUBMITTED', 'REJECTED']; // Sample dropdown values

  constructor(
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    private router: Router,
    private invoiceDataService: InvoiceDataService,
    private sidebarService: SidebarService,

  ) {}

  ngOnInit() {
    this.userRole = extractRolesFromToken()[0];
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
    });
    this.loadInvoices();
  }

  loadInvoices() {
    this.loading = true;
    const { invoiceNumber, vendorName } = this.filter;
    const selectedStatus = this.selectedStatus === 'All' ? '' : this.selectedStatus;

    let createdBy = getLoginUserEmail();
    if (this.userRole !== 'USER') {
      createdBy = '';
    }

    if (invoiceNumber || vendorName || selectedStatus) {
      this.invoiceService.getInvoiceByFilterList(invoiceNumber, vendorName, selectedStatus,createdBy, this.page, this.rows).subscribe(
        (response: any) => this.handleApiResponse(response),
        (error: any) => this.handleApiError(error)
      );
    } else if (this.userRole === 'USER') {
      const createdBy = getLoginUserEmail();
      this.invoiceService.getInvoiceListOfParticularUser(createdBy, this.page, this.rows).subscribe(
        (response: any) => this.handleApiResponse(response),
        (error: any) => this.handleApiError(error)
      );
    } else {
      this.invoiceService.getInvoiceList(this.page, this.rows).subscribe(
        (response: any) => this.handleApiResponse(response),
        (error: any) => this.handleApiError(error)
      );
    }
  }

  handleApiResponse(response: any) {
    this.invoiceList = response.data?.content || [];
    this.filteredInvoices = [...this.invoiceList];
    this.totalRecords = response.data?.totalElements || 0;
    this.loading = false;
  }

  handleApiError(error: any) {
    console.error('Error fetching invoices:', error);
    this.toastr.error('Something went wrong.', 'Error');
    this.loading = false;
  }

  filterValues(invoiceNumber: string, vendorName: string, status: string) {
    this.page = 0; // Reset to first page when filters change
    this.filter.invoiceNumber = invoiceNumber;
    this.filter.vendorName = vendorName;
    this.selectedStatus = status;
    this.loadInvoices();
  }

  trimDate(dateString: string): string {
    return dateString.split('T')[0]; // Split by 'T' and return the date part
  }

  onPageChange(event: any) {
    this.page = event.first / event.rows;
    this.rows = event.rows;
    this.loadInvoices();
  }

  viewInvoice(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe(
      (response: any) => {
        this.invoiceDataService.setInvoice(response.data);
        this.router.navigate(['/viewInvoiceDetail'], { queryParams: { invoiceNumber: response.invoiceNumber } });
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
        this.invoiceService.deleteInvoice(invoiceId).subscribe(
          () => {
            this.toastr.success('Invoice Deleted successfully', 'Success');
            this.loadInvoices(); // Reload invoices after deletion
          },
          (error: any) => {
            console.error('Error deleting invoice:', error);
            this.toastr.error('Error deleting invoice.', 'Error');
          }
        );
      }
    });
  }

  downloadPdf(invoiceId: string) {
    console.log("...... ",invoiceId)
    this.invoiceService.generatePdf(invoiceId).subscribe((base64Pdf: any) => {
      const pdfDataUrl = 'data:application/pdf;base64,' + base64Pdf.pdfData;
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `${invoiceId}.pdf`;
      link.click();
    });
  }
}
