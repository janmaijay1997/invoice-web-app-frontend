import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private sidebarService: SidebarService) { }

  ngOnInit() {
    // Subscribe to the sidebar active state
    let flage = localStorage.getItem("lastname");

    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state);

      this.sidebarActive = !state;
      // if (flage) {
      //   this.sidebarActive = true;
      // }
    });
  }

  showSidebar: any = false;
  sidebarActive: boolean = true;

  visibleSidebar: boolean = true;
  treeData: any = [
    {
      label: 'Dashboard',
      children: [],
    },
    {
      label: 'Function',
      children: [
        {
          label: 'Function 1',
        },
        {
          label: 'Function 2',
        },
      ],
    },
  ];

  toggleItem(node: any) {
    node['expanded'] = !node['expanded'];
  }
  flage = false;
  toggelSidebar() {
    this.flage = !this.flage;
  }
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
