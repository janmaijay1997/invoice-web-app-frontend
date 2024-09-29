import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { SidebarService } from 'src/app/services/sidebar.service';


interface CostCenter {
  name: string;
  code: string;
}

interface ExpenseType {
  type: string;
  code: string;
}

interface Department {
  departmentName: string;
  departmentManager: string;
  submitter: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  costCenterForm: FormGroup;
  expenseTypeForm: FormGroup;
  departmentForm: FormGroup;
  showSidebar: any = false;
  sidebarActive: boolean = true;
  visibleSidebar: boolean = true;

  costCenterList: CostCenter[] = [];
  expenseTypeList: ExpenseType[] = [];
  departmentList: Department[] = [];


  constructor(private sidebarService: SidebarService,
    private commonDetailsService: CommonDetailsService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder) {

    // Initialize the forms using FormBuilder
    this.costCenterForm = this.fb.group({
      centerName: new FormControl(''),
      centerCode: new FormControl(''),
    });

    this.expenseTypeForm = this.fb.group({
      expenseName: new FormControl(''),
      expenseCode: new FormControl(''),
    });

    this.departmentForm = this.fb.group({
      departmentName: new FormControl(''),
      departmentManager: new FormControl(''),
      submitter: new FormControl(''),
    });
  }

  ngOnInit() {
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state);

      this.sidebarActive = !state;
    });
  }


  createCostCenter() {
    const requestData = {
      centerName: this.costCenterForm.get("centerName")?.value,
      centerCode: this.costCenterForm.get("centerCode")?.value,
    };

    this.commonDetailsService.createCostCenter(requestData).subscribe((response: any) => {
      this.toastr.success('Cost Center Created successFully', 'Success', {
        timeOut: 300000, // Optional - already set in forRoot
      });
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }

  getCostCenterList() {
    this.commonDetailsService.getCostCenterList().subscribe((response: any) => {
      this.costCenterList = response;
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }


  createExpenseType() {
    const requestData = {
      expenseName: this.costCenterForm.get("expenseName")?.value,
      expenseCode: this.costCenterForm.get("expenseCode")?.value,
    };

    this.commonDetailsService.createExpenseType(requestData).subscribe((response: any) => {
      this.toastr.success('Expense Type Created successFully', 'Success', {
        timeOut: 300000, // Optional - already set in forRoot
      });
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }

  getExpenseTypeList() {
    this.commonDetailsService.getExpenseTypeList().subscribe((response: any) => {
      this.expenseTypeList = response;
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }


  createDepartments() {
    const requestData = {
      departmentName: this.costCenterForm.get("departmentName")?.value,
      departmentManager: this.costCenterForm.get("departmentManager")?.value,
      submitter: this.costCenterForm.get("submitter")?.value,
    };

    this.commonDetailsService.createDepartments(requestData).subscribe((response: any) => {
      this.toastr.success('Departments Created successFully', 'Success', {
        timeOut: 300000, // Optional - already set in forRoot
      });
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }

  getDepartmentsList() {
    this.commonDetailsService.getDepartmentsList().subscribe((response: any) => {
      this.departmentList = response;
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');
    })
  }

}
