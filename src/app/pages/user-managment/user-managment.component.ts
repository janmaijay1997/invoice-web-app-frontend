import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-user-managment',
  templateUrl: './user-managment.component.html',
  styleUrls: ['./user-managment.component.scss']
})
export class UserManagmentComponent implements OnInit {
  constructor(private sidebarService: SidebarService) { }

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

  } 
  deactivateUser(val: any) {

  }
  editUser(val: any) {

  }
  createUser() {

  }

  users: any = [
    {id:1,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:2,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:3,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:4,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:5,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:6,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:7,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:8,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:9,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:10,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:11,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:12,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:13,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:14,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:15,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:16,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:17,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:18,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:19,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
    {id:20,name:'abc',email:'abc@gmail.com',role:'Admin',status:'Active'},
  
  ]

}
