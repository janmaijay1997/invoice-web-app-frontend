import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PagesComponent } from './pages.component';
import { ViewInvoiceDetailsComponent } from './view-invoice-details/view-invoice-details.component';
const routes: Routes = [

  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'addUser', component: AddUserComponent },
      { path: 'userView', component: UserManagmentComponent },
      { path: 'addInvoice', component: AddInvoiceComponent },
      { path: 'InvoiceView', component: ViewInvoiceComponent },
      { path: 'viewInvoiceDetail', component: ViewInvoiceDetailsComponent },
    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
