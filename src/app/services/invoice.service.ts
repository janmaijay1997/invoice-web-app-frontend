import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private httpClient:HttpClient) { }

  createInvoice(createInvoiceRequestData:any):any {
      return this.httpClient.post(environment.createInvoiceUrl,createInvoiceRequestData);
  }
}