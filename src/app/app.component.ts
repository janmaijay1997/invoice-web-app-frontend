import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'invoiceWeb';

  sidebarActive: boolean = true;
  menuItems: any[] = [
    { label: 'Dashboard', submenu: [], active: false },
    // { label: 'User Managment', submenu: ['Add User', 'View User'], active: false },
    { label: 'View User', submenu: [], active: false },
    { label: 'Add User ', submenu: [], active: false },
    { label: 'View invoice', submenu: [], active: false },
    { label: 'Add invoice', submenu: [], active: false },
  ];
  submenuActive: boolean[] = [];
  activeMenuIndex: number | null = null;
  activeSubmenuIndex: number | null = null;

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }

  toggleSubmenu(index: number) {
    this.submenuActive[index] = !this.submenuActive[index];
  }
  selectedVal = 'Dashboard';
  setActiveMenuItem(index: number, val: any

  ) {
    console.log(index);
    console.log(val.label);
    console.log(val);

    this.selectedVal = val.label;


    this.activeMenuIndex = index;
    this.activeSubmenuIndex = null; // Reset submenu selection if a new menu is clicked
  }

  setActiveSubmenuItem(menuIndex: number, subIndex: number) {

    this.activeMenuIndex = menuIndex;
    this.activeSubmenuIndex = subIndex;
  }
}
