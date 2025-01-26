import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserManagmentComponent } from './user-managment/user-managment.component';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';
import { PagesComponent } from './pages.component';
import { ViewInvoiceDetailsComponent } from './view-invoice-details/view-invoice-details.component';
import { PettyCashComponent } from './petty-cash/petty-cash.component';
import { UpdateUserDetailsComponent } from './update-user-details/update-user-details.component';
import { AuthGuard } from '../auth.guard';
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
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN']},},
      { path: 'addUser', component: AddUserComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN']},},
      { path: 'userView', component: UserManagmentComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN']},},
      { path: 'addInvoice', component: AddInvoiceComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'USER']},},
      { path: 'pettyCash', component: PettyCashComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'USER']},},
      { path: 'InvoiceView', component: ViewInvoiceComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'USER']},},
      { path: 'viewInvoiceDetail', component: ViewInvoiceDetailsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN', 'USER']},},
      { path: 'updateUserDetails', component: UpdateUserDetailsComponent, canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SUPER_ADMIN']},},

    ]
  }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
