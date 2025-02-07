import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';
import { extractRolesFromToken } from 'src/app/utils/jwt-util';
import { MatDialog } from '@angular/material/dialog';
import { UpdateUserPasswordComponent } from 'src/app/pages/update-user-password/update-user-password.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService,
    private toastService : ToastService,
    private dialog: MatDialog,
    private router: Router) { }
  loginData = {
    email: "",
    password: "",
    otp:""
  }
  otpInput = false;
  ngOnInit(): void {
  }


  onSubmit(loginForm: any) {
    if (loginForm.valid) {
      this.userService.login(this.loginData).subscribe({
        next: (response: HttpResponse<any>) => {
          console.log(response);
          if(!response.body.data){
            if(response.status === 200){
              this.toastService.showSuccess(response.body.responseMessage);
              this.otpInput = true;
            }else{
              this.toastService.showError(response.body.responseMessage);
            }
          }else{
            localStorage.setItem('token', response.body.data.token);
            const userRoles = extractRolesFromToken();
            if(userRoles[0] === 'USER'){
              this.router.navigate(['/addInvoice']);
            }else{
              this.router.navigate(['/dashboard']);
            }
           
          }
        },
        error: (e: any) => {
          console.error(e);
          if(e.status==401){
            this.toastService.showError(e.error.responseMessage);
            this.otpInput = false;
          }
          
        },
        complete() {
          console.log("is completed");
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
  openForgotPasswordDialog(): void {
    const dialogRef = this.dialog.open(UpdateUserPasswordComponent, {
      width: '400px',
      data: {
        isAdmin: false  // This is the "User" mode for resetting password
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the result here, e.g., send form data to backend to update password
        console.log('Password Change Data:', result);
      }
    });
  }
}
