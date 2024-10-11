import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { extractRolesFromToken } from 'src/app/utils/jwt-util';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[] = [
    { label: 'Dashboard', route: '/dashboard', active: false, roles: ['ADMIN', 'SUPER_ADMIN'], icon: 'fa-tachometer-alt' },
    { label: 'View User', route: '/userView', active: false, roles: ['ADMIN', 'SUPER_ADMIN'], icon: 'fa-users' },
    { label: 'Add User', route: '/addUser', active: false, roles: ['ADMIN', 'SUPER_ADMIN'], icon: 'fa-user-plus' },
    { label: 'View Invoice', route: '/InvoiceView', active: false, roles: ['ADMIN', 'SUPER_ADMIN'], icon: 'fa-file-invoice' },
    { label: 'Add Invoice', route: '/addInvoice', active: false, roles: ['ADMIN', 'SUPER_ADMIN', 'USER'], icon: 'fa-file-invoice-dollar' },
    { label: 'Petty Cash', route: '/pettyCash', active: false, roles: ['ADMIN', 'SUPER_ADMIN', 'USER'], icon: 'fa-wallet' }
  ];

  submenuActive: boolean[] = [];
  activeMenuIndex: number | null = null;
  activeSubmenuIndex: number | null = null;
  userRoles: string[] = [];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    // Decode JWT token and extract roles
    this.userRoles = extractRolesFromToken();

    // Filter menu items based on roles
    this.filterMenuItemsBasedOnRoles();

    // Set the active item based on the current route when the component initializes
    this.setActiveItemBasedOnRoute(this.router.url);

    // Subscribe to router events to update the active item on navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveItemBasedOnRoute(event.urlAfterRedirects);
      }
    });
  }


  filterMenuItemsBasedOnRoles() {
    this.menuItems = this.menuItems.filter(item =>
      item.roles.some((role :any) => this.userRoles.includes(role))
    );
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
