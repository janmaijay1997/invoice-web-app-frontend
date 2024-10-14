import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
export interface ChangePasswordDialogData {
  email: string;
  isAdmin: boolean;
}
@Component({
  selector: 'app-update-user-password',
  templateUrl: './update-user-password.component.html',
  styleUrls: ['./update-user-password.component.scss']
})


export class UpdateUserPasswordComponent  {
  changePasswordForm: FormGroup;
  isAdmin: boolean;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<UpdateUserPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordDialogData // Injecting the data passed to the dialog
  ) {
    this.isAdmin = data.isAdmin;

    // Initialize the form and conditionally set the email field
    this.changePasswordForm = this.fb.group({
      email: [{ value: data.email || '', disabled: this.isAdmin }, [Validators.required, Validators.email]],
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Close the dialog
  onCancel(): void {
    this.dialogRef.close();
  }

  // Submit the form and close the dialog
  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const changePasswordRequest = {
        email:this.changePasswordForm.value.email,
        oldPassword: this.changePasswordForm.value.oldPassword,
        newPassword: this.changePasswordForm.value.newPassword
      };
if(this.isAdmin){
  this.userService.adminChangePassword(changePasswordRequest).subscribe(
    (response) => {
      console.log('Password changed successfully', response);
      this.toastr.success('Password changed successfully');

      this.dialogRef.close();
    },
    (error) => {
      console.error('Error changing password', error);
    }
  );
}else{
      this.userService.changePassword(changePasswordRequest).subscribe(
        (response) => {
          console.log('Password changed successfully', response);
          this.toastr.success('Password changed successfully');

          this.dialogRef.close();
        },
        (error) => {
          console.error('Error changing password', error);
        }
      );
    }
  }
  }
}