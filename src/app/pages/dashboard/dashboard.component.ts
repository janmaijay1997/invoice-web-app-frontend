import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    private fb: FormBuilder) {

    this.expenseTypeForm = this.fb.group({
      expenseName: new FormControl(''),
      expenseCode: new FormControl(''),
    });

    this.departmentForm = this.fb.group({
      departmentName: new FormControl(''),
      departmentManager: new FormControl(''),
      submitter: new FormControl(''),
    });

    this.costCenterForm = this.fb.group({
      costCenters: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state);
      this.sidebarActive = !state;
    });

    this.getCostCenterList();
  }

  get costCenters(): FormArray {
    return this.costCenterForm.get('costCenters') as FormArray;
  }


  // Method to create a new Cost Center (and push to the form)
  createCostCenter() {
    const requestData = {
      name: this.costCenterForm.get('name')?.value,
      code: this.costCenterForm.get('code')?.value,
    };

    if (requestData.name && requestData.code) {
      this.commonDetailsService.createCostCenter(requestData).subscribe(
        (response: any) => {
          this.toastr.success('Cost Center created successfully', 'Success', {
            timeOut: 3000,
          });

          // Add the new cost center to the form and list
          const newCostCenterGroup = this.fb.group({
            name: [requestData.name],
            code: [requestData.code]
          });
          this.costCenters.push(newCostCenterGroup);
          this.costCenterList.push(requestData); // Add to list after successful creation
        },
        (error: any) => {
          console.error('Error creating Cost Center:', error);
          this.toastr.error('Failed to create Cost Center.', 'Error');
        }
      );
    } else {
      this.toastr.error('Please provide valid Cost Center details.', 'Error');
    }
  }

  // Fetch the cost center list and populate the form array
  async getCostCenterList() {
    this.commonDetailsService.getCostCenterList().subscribe(
      (response: any) => {
        this.costCenterList = response;
        this.populateFormArray();
      },
      (error: any) => {
        console.error('Error fetching Cost Center list:', error);
        this.toastr.error('Failed to fetch Cost Center list.', 'Error');
      }
    );
  }

  // Populate the form array with existing cost centers
  populateFormArray() {
    this.costCenterList.forEach((costCenter: CostCenter) => {
      const group = this.fb.group({
        name: [costCenter.name],
        code: [costCenter.code]
      });
      this.costCenters.push(group);
    });
  }

  saveCostCenter(index: number) {
    const updatedCostCenter = this.costCenters.at(index).value;

    this.commonDetailsService.createCostCenter(updatedCostCenter).subscribe((response: any) => {
      this.toastr.success('Cost Center saved successfully', 'Success');
      this.costCenterList[index] = updatedCostCenter;
    },
      (error: any) => {
        console.error('Error saving Cost Center:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }









  // ------------------------------------------------------------------------------------------------

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
