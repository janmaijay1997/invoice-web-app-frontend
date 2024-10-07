import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient: HttpClient) { }

  createInvoice(createInvoiceRequestData: any): any {
    return this.httpClient.post(environment.createInvoiceUrl, createInvoiceRequestData);
  }

  getInvoiceList(): any {
    return this.httpClient.get(environment.invoiceListUrl);
  }

  getInvoiceDetails(invoiceId: string): any {
    return this.httpClient.get(environment.invoiceDetailsUrl + invoiceId);
  }

  deleteInvoice(invoiceId: string): any {
    return this.httpClient.delete(environment.deleteInvoiceUrl + '?id=' + invoiceId);
  }
  generatePdf(invoiceId: string): any {
    return this.httpClient.get<any>(`${environment.getInvoicePdfUrl}/${invoiceId}`);


  }
}