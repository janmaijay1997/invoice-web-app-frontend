import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class InvoiceDataService {
  private invoice: any;

  setInvoice(invoice: any) {
    this.invoice = invoice;
  }

  getInvoice() {
    return this.invoice;
  }

  clearInvoice() {
    this.invoice = null;
  }
}
