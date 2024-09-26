import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  constructor(private sidebarService: SidebarService) { }
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

  } users: any = [];


  userRollList = [
    { name: 'Admin', code: 'admin' },
];
  deactivateUser(val: any) {

  }
  editUser(val: any) {

  }
  createUser() {

  }


}
