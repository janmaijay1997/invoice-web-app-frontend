import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';
import { UserDataService } from 'src/app/services/userdetailsservice';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss']
})
export class UpdateUserDetailsComponent implements OnInit {

  addUserFormGroup: FormGroup;

  constructor(
    private sidebarService: SidebarService,
    private userService: UserService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private userDataService: UserDataService,
    private fb: FormBuilder
  ) {
    // Initialize the form group with controls
    this.addUserFormGroup = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      country: ['', Validators.required],
      department: ['', Validators.required],
      roles: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  visible: boolean = false;
  sidebarActive: boolean = false;
  userDetails: any;

  ngOnInit() {
    // Subscribe to the sidebar active state
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      this.sidebarActive = !state;
      if (flage) {
        this.sidebarActive = true;
      }

      this.route.queryParams.subscribe(params => {
        const email = params['email'];
        // Fetch the invoice data using the invoiceId
        this.getUserDetails(email);
        const user = this.userDataService.getUser();
        this.populateForm(user);

      });
    });
  }

  
  navigateToInvoiceView(): void {
    this.router.navigate(['/userView']);
  }

  populateForm(user: any): void {
    console.log("Ur : ", user)
    this.addUserFormGroup.patchValue({
      name: user.name,
      surname: user.surname,
      email: user.email,
      phone: user.phoneNumber,
      country: user.country,
      department: user.department,
      roles: user.roles[0],
    });
  }


  users: any = [];

  // Define role list
  userRollList = [
    { name: 'SUPER ADMIN', code: 'SUPER_ADMIN' },
    { name: 'ADMIN', code: 'ADMIN' },
    { name: 'USER', code: 'USER' }
  ];

  deactivateUser(val: any) { }

  editUser(val: any) { }

  updateUser(email: any) {

    // Get the form values
    const formData = this.addUserFormGroup.value;

    // Convert the 'roles' field (single selected role) into an array before sending to API
    const userPayload = {
      ...formData,
      roles: [formData.roles] // Wrap the selected role in an array
    };
    this.userService.updateUser(email, userPayload).subscribe({
      next: () => {
        this.toastr.success('User Updated successfully');
        this.router.navigate(['/userView']);
        // this.addUserFormGroup.reset();
      },
      error: (error: any) => {
        this.toastr.error('Failed to Update user');
        console.error('Error updating user:', error);
      }
    });
  }


  // Placeholder method for editing a user
  getUserDetails(email: string) {
    this.userService.getUserDetails(email).subscribe(
      (response: any) => {
        this.userDetails = response.data.userDetails;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }

  // Getters for each form control in the form group
  get name() {
    return this.addUserFormGroup.get('name');
  }

  get surname() {
    return this.addUserFormGroup.get('surname');
  }

  get email() {
    return this.addUserFormGroup.get('email');
  }

  get phone() {
    return this.addUserFormGroup.get('phone');
  }

  get country() {
    return this.addUserFormGroup.get('country');
  }

  get department() {
    return this.addUserFormGroup.get('department');
  }

  get roles() {
    return this.addUserFormGroup.get('roles');
  }
  get password() {
    return this.addUserFormGroup.get('password');
  }

}

