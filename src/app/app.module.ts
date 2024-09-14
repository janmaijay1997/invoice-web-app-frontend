import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './main/dashboard/dashboard.component';
// import { SidebarModule } from 'primeng/sidebar';
// import { ButtonModule } from 'primeng/button';
// import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    // SidebarModule,
    // TreeModule,
    // ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
