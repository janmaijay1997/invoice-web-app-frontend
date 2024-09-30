import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  expenseName: string;
  expenseCode: string;
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

  newCostCenterForm: FormGroup;
  costCenterForm: FormGroup;
  showAddModal = false;

  newExpenseTypeForm: FormGroup;
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


    this.departmentForm = this.fb.group({
      departmentName: new FormControl(''),
      departmentManager: new FormControl(''),
      submitter: new FormControl(''),
    });

    this.costCenterForm = this.fb.group({
      costCenters: this.fb.array([]),
    });

    this.newCostCenterForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
    });


    this.expenseTypeForm = this.fb.group({
      expenseTypes: this.fb.array([]),
    });

    this.newExpenseTypeForm = this.fb.group({
      expenseName: ['', Validators.required],
      expenseCode: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state);
      this.sidebarActive = !state;
    });

    this.getCostCenterList();
    this.getExpenseTypeList();
  }

  get costCenters(): FormArray {
    return this.costCenterForm.get('costCenters') as FormArray;
  }

  get expenseTypes(): FormArray {
    return this.expenseTypeForm.get('expenseTypes') as FormArray;
  }


  openAddModal() {
    this.showAddModal = true;
  }

  closeAddModal() {
    this.showAddModal = false;
  }


  createNewCostCenter() {
    if (this.newCostCenterForm.valid) {
      const newCostCenter = this.newCostCenterForm.value;

      // Push the new cost center into the form array
      this.costCenters.push(this.fb.group({
        name: [newCostCenter.name],
        code: [newCostCenter.code],
      }));

      this.commonDetailsService.createCostCenter(newCostCenter).subscribe(
        (response: any) => {
          this.toastr.success('Cost Center created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeAddModal();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
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
    if (this.newExpenseTypeForm.valid) {
      const newExpenseType = this.newExpenseTypeForm.value;

      // Push the new cost center into the form array
      this.expenseTypes.push(this.fb.group({
        expenseName: [newExpenseType.type],
        expenseCode: [newExpenseType.code],
      }));

      this.commonDetailsService.createExpenseType(newExpenseType).subscribe(
        (response: any) => {
          this.toastr.success('Expense Type created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeAddModal();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
    }
  }

  // Fetch the cost center list and populate the form array
  async getExpenseTypeList() {
    this.commonDetailsService.getExpenseTypeList().subscribe(
      (response: any) => {
        this.expenseTypeList = response;
        this.populateExpenseTypeFormArray();
      },
      (error: any) => {
        console.error('Error fetching Cost Center list:', error);
        this.toastr.error('Failed to fetch Cost Center list.', 'Error');
      }
    );
  }

  populateExpenseTypeFormArray() {
    this.expenseTypeList.forEach((expenseType: ExpenseType) => {
      const group = this.fb.group({
        expenseName: [expenseType.expenseName],
        expenseCode: [expenseType.expenseCode]
      });
      this.expenseTypes.push(group);
    });
  }

  saveExpenseType(index: number) {
    const updatedExpenseType = this.expenseTypes.at(index).value;

    this.commonDetailsService.createExpenseType(updatedExpenseType).subscribe((response: any) => {
      this.toastr.success('Expense Type saved successfully', 'Success');
      this.costCenterList[index] = updatedExpenseType;
    },
      (error: any) => {
        console.error('Error saving Expense Type:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }






  //  --------------------------------------------------------------

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
