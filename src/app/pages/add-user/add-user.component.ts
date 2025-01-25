import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addUserFormGroup: FormGroup;

  constructor(
    private sidebarService: SidebarService,
    private userService: UserService,
    private toastr: ToastrService,
    private fb: FormBuilder,
    private router: Router
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
      password:['',Validators.required]
    });
  }

  visible: boolean = false;
  sidebarActive: boolean = false;

  ngOnInit() {
    // Subscribe to the sidebar active state
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      this.sidebarActive = !state;
      if (flage) {
        this.sidebarActive = true;
      }
    });
  }

  users: any = [];

  // Define role list
  userRollList = [
    { name: 'SUPER ADMIN', code: 'SUPER_ADMIN' },
    { name: 'ADMIN', code: 'ADMIN' },
    { name: 'USER', code: 'USER' }
  ];

  deactivateUser(val: any) {}

  editUser(val: any) {}

   navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  createUser() {
    if (this.addUserFormGroup.invalid) {
      this.toastr.error('Please fill in all required fields');
      return;
    }

    // Get the form values
    const formData = this.addUserFormGroup.value;

    // Convert the 'roles' field (single selected role) into an array before sending to API
    const userPayload = {
      ...formData,
      roles: [formData.roles] // Wrap the selected role in an array
    };
    this.userService.createUser(userPayload).subscribe({
      next: () => {
        this.toastr.success('User created successfully');
        this.addUserFormGroup.reset();
      },
      error: (error: any) => {
        this.toastr.error('Failed to create user');
        console.error('Error creating user:', error);
      }
    });
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
