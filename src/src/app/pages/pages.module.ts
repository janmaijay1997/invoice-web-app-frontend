
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
@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SidebarComponent,
    AddUserComponent,
    DashboardComponent,
    AddInvoiceComponent,
    ViewInvoiceComponent,
    UserManagmentComponent
  ],
  imports: [
    CommonModule,
    // RouterModule ,
    PagesRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    PanelMenuModule,
    ButtonModule,
    TableModule 

  ],
  providers: [],
  exports: [
    [ RouterModule ]
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],

})
export class PagesModule { }
