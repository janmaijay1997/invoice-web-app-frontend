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

  newCostCenterForm: FormGroup;
  costCenterForm: FormGroup;
  showAddModal = false;


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


    // Form for new Cost Center in modal
    this.newCostCenterForm = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
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

      // Optionally save it to the server
      this.commonDetailsService.createCostCenter(newCostCenter).subscribe(
        (response: any) => {
          this.toastr.success('Cost Center created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      // Close the modal
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
