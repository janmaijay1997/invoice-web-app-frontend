import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CommonDetailsService {


  constructor(private httpClient: HttpClient) { }

  getAllOtherDetails() {
    return this.httpClient.get(environment.otherDetailsUrl);
  }

  createCostCenter(requetBody: any): any {
    return this.httpClient.post(environment.createCostCenterUrl, requetBody);
  }

  createExpenseType(requetBody: any): any {
    return this.httpClient.post(environment.createExpenseTypeUrl, requetBody);
  }

  createDepartments(requetBody: any): any {
    return this.httpClient.post(environment.createDepartmentUrl, requetBody);
  }

  createVendor(requetBody: any): any {
    return this.httpClient.post(environment.createVendorUrl, requetBody);
  }



  getCostCenterList() {
    return this.httpClient.get(environment.GetCostCentersUrl);
  }

  getExpenseTypeList() {
    return this.httpClient.get(environment.GetExpenseTypesUrl);
  }

  getDepartmentsList() {
    return this.httpClient.get(environment.GetDepartmentsUrl);
  }

  getVendorList(): any {
    return this.httpClient.get(environment.GetVendorUrl);
  }

  deleteCostCenter(requetBody: any): any {
    return this.httpClient.delete(environment.deleteCostCentersUrl + '?id=' + requetBody);
  }

  
  deleteExpenseTypes(requetBody: any): any {
    return this.httpClient.delete(environment.deleteExpenseTypesUrl+ '?id=' + requetBody);
  }

  deleteDepartments(requetBody: any): any {
    return this.httpClient.post(environment.deleteDepartmentsUrl+ '?id=' + requetBody,{});
  }

  deleteVendor(requetBody: any): any {
    return this.httpClient.delete(environment.deleteVendorUrl+'?id=' + requetBody);
  }
}
