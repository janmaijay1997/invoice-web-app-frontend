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
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultRequestOptions } from './services/interceptor';
import { ExpenseTypeModalComponent } from './components/expense-type-modal/expense-type-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UpdateUserPasswordComponent } from './pages/update-user-password/update-user-password.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


// import {TableModule} from 'primeng/table';

 
// import {TableModule} from 'primeng/table';



// import { SidebarModule } from 'primeng/sidebar';
// import { ButtonModule } from 'primeng/button';
// import { TreeModule } from 'primeng/tree';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ExpenseTypeModalComponent, 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    PagesModule ,
    RouterModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    // TableModule
    // SidebarModule,
    // TreeModule,
    // ButtonModule
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',  // Set position to top right
      timeOut: 5000,  // 3 seconds duration
      closeButton: true,  // Show a close button on toast
      progressBar: true,  // Show progress bar on toast
      preventDuplicates: true,  // Prevent duplicate toasts
    }), //
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: DefaultRequestOptions,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  entryComponents: [UpdateUserPasswordComponent] ,

  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class AppModule { }
