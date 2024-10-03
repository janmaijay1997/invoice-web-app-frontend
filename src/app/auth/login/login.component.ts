import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';
import { extractRolesFromToken } from 'src/app/utils/jwt-util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private userService: UserService,
    private toastService : ToastService,
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
        },
        complete() {
          console.log("is completed");
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
