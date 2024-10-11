import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

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
    localStorage.clear();
    localStorage.removeItem('token')
    this.router.navigate(['/login'])
    // You can add actual logout logic here, like redirecting to a login page or clearing session data
  }
}
