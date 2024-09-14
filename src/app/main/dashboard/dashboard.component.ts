import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor() { }
  showSidebar: any = false;
  ngOnInit(): void {
  }
  visibleSidebar: boolean = false;
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
  flage = true;
  toggelSidebar() {
    this.flage = !this.flage;
  }
}
