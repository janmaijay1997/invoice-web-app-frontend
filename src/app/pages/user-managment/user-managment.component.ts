import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SidebarService } from 'src/app/services/sidebar.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss']
})
export class UserManagmentComponent implements OnInit {
  users: any[] = [];        // Users to display in the table
  totalRecords: number = 0; // Total records for pagination
  loading: boolean = true;  // To show loading spinner

  // Pagination variables
  page: number = 0;
  rows: number = 10; // Number of rows per page

  constructor(private sidebarService: SidebarService,private userService:UserService,private toastr:ToastrService) { }

  sidebarActive: boolean = false;
  ngOnInit() {
    // Subscribe to the sidebar active state
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      this.sidebarActive = state;
      if (flage) {
        this.sidebarActive = true;
      }
    });
    this.loadUsers(this.page, this.rows);

  } 
  loadUsers(page: number, size: number) {
    this.loading = true;
    this.userService.getUsers(page, size).subscribe({
      next: (response: any) => {
        // Map the API response to users list
        this.users = response.data.content.map((user: any) => ({
          id: user.userDetails.phoneNumber, // Assuming phone number is used as ID, adjust as needed
          name: `${user.userDetails.name} ${user.userDetails.surname}`,
          email: user.userDetails.email,
          role: user.userDetails.roles[0] || 'N/A', // Display first role
          status: 'Active' // Placeholder for status, adjust as needed
        }));
        this.totalRecords = response.data.totalElements; // Total records for pagination
        this.loading = false;
      },
      error: (err) => {
        this.toastr.error('Failed to load users');
        console.error('Error fetching users:', err);
        this.loading = false;
      }
    });
  }

  // Placeholder method for deactivating a user
  deactivateUser(userId: string) {
    this.toastr.warning(`Deactivate user with ID: ${userId}`);
    // Logic for deactivating user
  }

  // Placeholder method for editing a user
  editUser(userId: string) {
    this.toastr.info(`Edit user with ID: ${userId}`);
    // Logic for editing user
  }

  // Method to handle page changes (pagination)
  onPageChange(event: any) {
    this.page = event.page;
    this.rows = event.rows;
    this.loadUsers(this.page, this.rows); // Fetch users for the new page
  }

}
