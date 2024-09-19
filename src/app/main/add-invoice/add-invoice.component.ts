import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  sidebarActive: boolean = false;
  clientName: string = '';
  invoiceDate: string = '';
  items: any[] = [
    {
      vendorInvoiceRef: '',
      vendorId: '',
      costCode: '',
      expenseCode: '',
      quantity: '',
      unit: '',
      description: '',
      expenceType: '',
      currency: '',
      subtotal: 0
    }
  ];

  vendors = [
    { id: '1', name: 'Vendor 1' },
    { id: '2', name: 'Vendor 2' },
    { id: '3', name: 'Vendor 3' }
  ];

  costCodes = ['CostCode1', 'CostCode2', 'CostCode3'];
  expenseCodes = ['ExpenseCode1', 'ExpenseCode2', 'ExpenseCode3'];
  units = ['PCS', 'KG', 'Litre'];
  currencies = ['USD', 'EUR', 'GBP'];

  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    let flage = localStorage.getItem("lastname");
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      this.sidebarActive = !state;
      if (flage) {
        this.sidebarActive = true;
      }
    });
  }

  addItem() {
    this.items.push({
      vendorInvoiceRef: '',
      vendorId: '',
      costCode: '',
      expenseCode: '',
      quantity: 0,
      amount: 0,
      unit: '',
      description: '',
      expenceType: '',
      currency: '',
      subtotal: 0
    });
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  calculateSubtotalAmount(): number {
    return this.items.reduce((sum, item) => sum + (item.quantity * item.amount), 0);
}

  getGrandTotal(): number {
      return this.calculateSubtotalAmount(); // You can add more logic if needed
  }

  submitInvoice() {
    console.log('Invoice submitted', this.clientName, this.invoiceDate, this.items);
  }
}
