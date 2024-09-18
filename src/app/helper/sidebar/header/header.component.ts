import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  isPopupVisible = false;

  // Toggles the visibility of the popup
  togglePopup() {
    this.isPopupVisible = !this.isPopupVisible;
  }

  // Perform logout logic here
  logout() {
    console.log("User logged out");
    // You can add actual logout logic here, like redirecting to a login page or clearing session data
  }
}
