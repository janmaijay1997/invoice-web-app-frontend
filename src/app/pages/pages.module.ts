
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { PagesRoutingModule } from './pages-routing.module';
import { PagesComponent } from './pages.component';
import { HeaderComponent } from '../helper/header/header.component'
import { SidebarComponent } from '../helper/sidebar/sidebar.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddUserComponent } from './add-user/add-user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AddInvoiceComponent } from './add-invoice/add-invoice.component';
import { ViewInvoiceComponent } from './view-invoice/view-invoice.component';

import { UserManagmentComponent } from './user-managment/user-managment.component';
import { RouterModule } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ViewInvoiceDetailsComponent } from './view-invoice-details/view-invoice-details.component';
import { PettyCashComponent } from './petty-cash/petty-cash.component';
import { UpdateUserPasswordComponent } from './update-user-password/update-user-password.component';

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SidebarComponent,
    AddUserComponent,
    DashboardComponent,
    AddInvoiceComponent,
    ViewInvoiceComponent,
    UserManagmentComponent,
    ViewInvoiceDetailsComponent,
    PettyCashComponent,
    UpdateUserPasswordComponent,
  ],
  imports: [
    CommonModule,
    // RouterModule ,
    PagesRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    PanelMenuModule,
    ButtonModule,
    TableModule ,
    InputTextModule,
    DialogModule,
    DropdownModule,

  ],
  providers: [],
  exports: [
    [ RouterModule ]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class PagesModule { }
