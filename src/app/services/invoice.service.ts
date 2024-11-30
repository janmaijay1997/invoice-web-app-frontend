import { HttpClient, HttpParams } from '@angular/common/http';
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

  isVendorInvoiceRefAlreadyExist(vendorInvoiceRef: string): any {
    return this.httpClient.get(environment.vendorInvoiceRefAlreadyExistUrl + vendorInvoiceRef);
  }

  getInvoiceList(page: number, size: number): any {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get(environment.invoiceListUrl, { params });
  }
  
  getInvoiceByFilterList(invoiceNumber: any, vendorName: any, status: any, createdBy:any, page: number, size: number): any {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
  
    if (invoiceNumber) {
      params = params.set('invoiceNumber', invoiceNumber);
    }
    if (vendorName) {
      params = params.set('vendorName', vendorName);
    }
    if (status) {
      params = params.set('status', status);
    }
    
    params = params.set('createdBy', createdBy);
    
  
    return this.httpClient.get(environment.filteredInvoiceListUrl, { params });
  }
  
  getInvoiceListOfParticularUser(createdBy: string, page: number, size: number): any {
    const params = new HttpParams()
      .set('createdBy', createdBy)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.httpClient.get(environment.invoiceListForCreatedUserUrl, { params });
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