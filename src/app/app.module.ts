import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
import { UserManagmentComponent } from './main/user-managment/user-managment.component';
import { AddUserComponent } from './main/add-user/add-user.component';
import { SidebarComponent } from './helper/sidebar/sidebar.component';
import { ViewInvoiceComponent } from './main/view-invoice/view-invoice.component';
import { AddInvoiceComponent } from './main/add-invoice/add-invoice.component';
import { HeaderComponent } from './helper/sidebar/header/header.component';
// import {TableModule} from 'primeng/table';

 
// import { SidebarModule } from 'primeng/sidebar';
// import { ButtonModule } from 'primeng/button';
// import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    UserManagmentComponent,
    AddUserComponent,
    SidebarComponent,
    ViewInvoiceComponent,
    AddInvoiceComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // TableModule
    // SidebarModule,
    // TreeModule,
    // ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
