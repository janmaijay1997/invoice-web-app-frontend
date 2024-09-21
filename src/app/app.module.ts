import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PagesModule } from './pages/pages.module'; 
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './helper/header/header.component';
import { SidebarComponent } from './helper/sidebar/sidebar.component'; 
import { HttpClientModule } from '@angular/common/http';

// import {TableModule} from 'primeng/table';

 
// import {TableModule} from 'primeng/table';



// import { SidebarModule } from 'primeng/sidebar';
// import { ButtonModule } from 'primeng/button';
// import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  
    ReactiveFormsModule,
    FormsModule,
    PagesModule ,
    RouterModule
    // TableModule
    // SidebarModule,
    // TreeModule,
    // ButtonModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class AppModule { }
