import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  menuItems: any[] = [
    { label: 'Dashboard', route: '/dashboard', active: false },
    { label: 'View User', route: '/userView', active: false },
    { label: 'Add User', route: '/addUser', active: false },
    { label: 'View invoice', route: '/InvoiceView', active: false },
    { label: 'Add invoice', route: '/addInvoice', active: false }
  ];

  submenuActive: boolean[] = [];
  activeMenuIndex: number | null = null;
  activeSubmenuIndex: number | null = null;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // Set the active item based on the current route when the component initializes
    this.setActiveItemBasedOnRoute(this.router.url);

    // Subscribe to router events to update the active item on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveItemBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }

  setActiveItemBasedOnRoute(url: string) {
    // Set all items to inactive first
    this.menuItems.forEach(item => item.active = false);

    // Find the item that matches the current route and set it as active
    const matchingItem = this.menuItems.find(item => url.startsWith(item.route));
    if (matchingItem) {
      matchingItem.active = true;
    }
  }

  setActiveMenuItem(selectedItem: any) {
    // Set the clicked item as active and navigate to its route
    this.menuItems.forEach(item => item.active = false);
    selectedItem.active = true;
    this.router.navigate([selectedItem.route]);
  }
}
