import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { SidebarService } from 'src/app/services/sidebar.service';


interface CostCenter {
  id: number,
  name: string;
  code: string;
}

interface ExpenseType {
  id: number,
  expenseName: string;
  expenseCode: string;
}

interface Department {
  id: number,
  departmentName: string;
  departmentManager: string;
  submitter: string;
}

interface Vendor {
  id: string;
  vendorId: string;
  vendorName: string;
  address: string;
  phoneNumber: string;
  bankDetails: BankDetails;
}

interface BankDetails {
  bankName: string;
  ibanNumber: string;
  bankAddress: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  newCostCenterForm: FormGroup;
  costCenterForm: FormGroup;

  showAddExpenseTypeModal = false;
  editExpenseTypeModel = false;
  showAddCostCenterModel = false;
  editCostCenterModel = false;
  showAddDepartmenteModal = false;
  editDepartmenteModal = false;
  showAddVendorModal = false;


  newExpenseTypeForm: FormGroup;
  expenseTypeForm: FormGroup;

  newDepartmentForm: FormGroup;
  departmentForm: FormGroup;

  newVendorForm: FormGroup;
  vendorForm: FormGroup;

  showSidebar: any = false;
  sidebarActive: boolean = true;
  visibleSidebar: boolean = true;

  costCenterList: CostCenter[] = [];
  expenseTypeList: ExpenseType[] = [];
  departmentList: Department[] = [];
  vendorList: Vendor[] = [];



  constructor(private sidebarService: SidebarService,
    private commonDetailsService: CommonDetailsService,
    private toastr: ToastrService,
    private fb: FormBuilder) {


    this.costCenterForm = this.fb.group({
      costCenters: this.fb.array([]),
    });

    this.newCostCenterForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      code: ['', Validators.required],
    });


    this.expenseTypeForm = this.fb.group({
      expenseTypes: this.fb.array([]),
    });

    this.newExpenseTypeForm = this.fb.group({
      id: [''],
      expenseName: ['', Validators.required],
      expenseCode: ['', Validators.required],
    });

    this.departmentForm = this.fb.group({
      departments: this.fb.array([]),
    });

    this.newDepartmentForm = this.fb.group({
      id: [''],
      departmentName: new FormControl(''),
      departmentManager: new FormControl(''),
      submitter: new FormControl(''),
    });


    this.vendorForm = this.fb.group({
      vendors: this.fb.array([]),
    });

    this.newVendorForm = this.fb.group({
      vendorId: new FormControl(''),
      vendorName: new FormControl(''),
      bankDetails: new FormControl(''),
    });

  }

  ngOnInit() {
    this.sidebarService.sidebarActive$.subscribe((state: any) => {
      console.log(state);
      this.sidebarActive = !state;
    });

    this.getCostCenterList();
    this.getExpenseTypeList();
    this.getDepartmentsList();
    this.getVendorList();

  }

  get costCenters(): FormArray {
    return this.costCenterForm.get('costCenters') as FormArray;
  }

  get expenseTypes(): FormArray {
    return this.expenseTypeForm.get('expenseTypes') as FormArray;
  }

  get departments(): FormArray {
    return this.departmentForm.get('departments') as FormArray;
  }

  get vendors(): FormArray {
    return this.departmentForm.get('vendors') as FormArray;
  }

  openAddCostCenterModal() {
    this.showAddCostCenterModel = true;
  }
  closeAddCostCenterModel() {
    this.showAddCostCenterModel = false;
  }


  openAddExpenseTypeModal() {
    this.showAddExpenseTypeModal = true;
  }
  closeExpenseTypeModal() {
    this.showAddExpenseTypeModal = false;
  }

  openAddDepartmentsModal() {
    this.showAddDepartmenteModal = true;
  }
  closeDepartmentsModal() {
    this.showAddDepartmenteModal = false;
  }


  openAddVendorModal() {
    this.showAddVendorModal = true;
  }
  closeVendorModal() {
    this.showAddVendorModal = false;
  }

  // -----------------------------------------Cost Center-------------------------------------------------------

  createNewCostCenter() {
    if (this.newCostCenterForm.valid) {
      const newCostCenter = this.newCostCenterForm.value;
      console.log(newCostCenter);
      // Push the new cost center into the form array

      if (newCostCenter.id) {
        this.costCenters.push(this.fb.group({
          id: [newCostCenter.id],
          name: [newCostCenter.name],
          code: [newCostCenter.code],
        }));
      } else {
        this.costCenters.push(this.fb.group({
          name: [newCostCenter.name],
          code: [newCostCenter.code],
        }));
      }

      this.commonDetailsService.createCostCenter(newCostCenter).subscribe(
        (response: any) => {
          this.toastr.success('Cost Center created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeAddCostCenterModel();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
    }
  }

  editCostCenter(index: any) {
    this.editCostCenterModel = true;
    this.newCostCenterForm.setValue({
      id: index.value.id,
      name: index.value.name,
      code: index.value.code,
    });
    this.showAddCostCenterModel = true;
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
        id: [costCenter?.id],
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

  deleteCostCenter(index: any) {
    const updatedCostCenter = index.value;

    const requestData = {
      name: updatedCostCenter.name
    }

    this.commonDetailsService.deleteCostCenter(requestData).subscribe((response: any) => {
      this.toastr.success('Cost Center Deleted successfully', 'Success');
      this.costCenterList[index] = updatedCostCenter;
    },
      (error: any) => {
        console.error('Error Deleting Cost Center:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }

  // -----------------------------------------ExpenseType-------------------------------------------------------

  createExpenseType() {
    if (this.newExpenseTypeForm.valid) {
      const newExpenseType = this.newExpenseTypeForm.value;

      if (newExpenseType.id) {
        // Push the new cost center into the form array
        this.expenseTypes.push(this.fb.group({
          id: [newExpenseType.id],
          expenseName: [newExpenseType.type],
          expenseCode: [newExpenseType.code],
        }));

      } else {
        // Push the new cost center into the form array
        this.expenseTypes.push(this.fb.group({
          expenseName: [newExpenseType.type],
          expenseCode: [newExpenseType.code],
        }));
      }

      this.commonDetailsService.createExpenseType(newExpenseType).subscribe(
        (response: any) => {
          this.getExpenseTypeList();
          this.toastr.success('Expense Type created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeExpenseTypeModal();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
    }
  }

  editExpenseCenter(index: any) {
    this.editExpenseTypeModel = true;

    this.newExpenseTypeForm.setValue({
      id: index.value.id,
      expenseName: index.value.expenseName,
      expenseCode: index.value.expenseCode,
    });
    this.showAddExpenseTypeModal = true;
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
        id: [expenseType.id],
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


  deleteExpenseType(index: any) {
    const updatedExpenseType = index.value;

    const requestData = {
      name: updatedExpenseType.expenseName
    }

    this.commonDetailsService.deleteExpenseType(requestData).subscribe((response: any) => {
      this.toastr.success('Expense Type Deleted successfully', 'Success');
      this.expenseTypeList[index] = updatedExpenseType;
    },
      (error: any) => {
        console.error('Error Deleting Expense Type:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }


  // ------------------------Department------------------------------//


  createDepartments() {
    if (this.newDepartmentForm.valid) {
      const newDepartmentName = this.newDepartmentForm.value;

      if (newDepartmentName.id) {
        // Push the new Department into the form array
        this.costCenters.push(this.fb.group({
          id:  [newDepartmentName.id],
          departmentName: [newDepartmentName.departmentName],
          departmentManager: [newDepartmentName.departmentManager],
          submitter: [newDepartmentName.submitter],
        }));

      } else {
        // Push the new Department into the form array
        this.costCenters.push(this.fb.group({
          departmentName: [newDepartmentName.departmentName],
          departmentManager: [newDepartmentName.departmentManager],
          submitter: [newDepartmentName.submitter],
        }));

      }

      this.commonDetailsService.createDepartments(newDepartmentName).subscribe(
        (response: any) => {
          this.toastr.success('Department created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeDepartmentsModal();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
    }
  }

  editDepartment(index: any) {
    this.editDepartmenteModal = true;

    this.newDepartmentForm.setValue({
      id: index.value.id,
      departmentName: index.value.departmentName,
      departmentManager: index.value.departmentManager,
      submitter: index.value.submitter,
    });
    this.showAddDepartmenteModal = true;
  }


  async getDepartmentsList() {
    this.commonDetailsService.getDepartmentsList().subscribe(
      (response: any) => {
        this.departmentList = response;
        this.populateDepartmentsFormArray();
      },
      (error: any) => {
        console.error('Error fetching Department list:', error);
        this.toastr.error('Failed to fetch Department list.', 'Error');
      }
    );
  }


  populateDepartmentsFormArray() {
    this.departmentList.forEach((department: Department) => {
      const group = this.fb.group({
        id: department.id,
        departmentName: [department.departmentName],
        departmentManager: [department.departmentManager],
        submitter: [department.submitter],
      });
      this.departments.push(group);
    });
  }


  saveDepartment(index: number) {
    const updatedDepartments = this.departments.at(index).value;

    this.commonDetailsService.createDepartments(updatedDepartments).subscribe((response: any) => {
      this.toastr.success('Department saved successfully', 'Success');
      this.departmentList[index] = updatedDepartments;
    },
      (error: any) => {
        console.error('Error saving Departments:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }


  deleteDepartment(index: any) {
    const updatedDepartment = index.value;

    const requestData = {
      name: updatedDepartment.departmentName
    }

    this.commonDetailsService.deleteExpenseType(requestData).subscribe((response: any) => {
      this.toastr.success('Department Deleted successfully', 'Success');
      this.departmentList[index] = updatedDepartment;
    },
      (error: any) => {
        console.error('Error Deleting Department:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }



  // ----------------------------------------

  createVendor() {
    if (this.newVendorForm.valid) {
      const newVendor = this.newVendorForm.value;

      // Push the new Department into the form array
      this.vendors.push(this.fb.group({
        vendorId: [newVendor.vendorId],
        vendorName: [newVendor.vendorName],
        address: [newVendor.address],
        phoneNumber: [newVendor.phoneNumber],
        bankDetails: [newVendor.bankDetails],
      }));

      this.commonDetailsService.createVendor(newVendor).subscribe(
        (response: any) => {
          this.toastr.success('Department created successfully', 'Success');
        },
        (error: any) => {
          this.toastr.warning(error.error, 'Error');
        }
      );

      this.closeDepartmentsModal();
    } else {
      this.toastr.error('Please fill out the form.', 'Error');
    }
  }


  async getVendorList() {
    this.commonDetailsService.getVendorList().subscribe(
      (response: any) => {
        this.vendorList = response;
        this.populateVendorsFormArray();
      },
      (error: any) => {
        console.error('Error fetching Vendor list:', error);
        this.toastr.error('Failed to fetch Vendor list.', 'Error');
      }
    );
  }


  populateVendorsFormArray() {
    this.vendorList.forEach((vendor: Vendor) => {
      const group = this.fb.group({
        vendorId: [vendor.vendorId],
        vendorName: [vendor.vendorName],
        address: [vendor.address],
        phoneNumber: [vendor.phoneNumber],
        bankDetails: [vendor.bankDetails],
      });
      this.vendors.push(group);
    });
  }


  saveVendor(index: number) {
    const updatedDepartments = this.vendors.at(index).value;

    this.commonDetailsService.createVendor(updatedDepartments).subscribe((response: any) => {
      this.toastr.success('Vendor saved successfully', 'Success');
      this.departmentList[index] = updatedDepartments;
    },
      (error: any) => {
        console.error('Error saving Vendor:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }


  deleteVendor(index: number) {
    const updatedDepartment = this.costCenters.at(index).value;

    const requestData = {
      name: updatedDepartment.departmentName
    }

    this.commonDetailsService.deleteVendor(requestData).subscribe((response: any) => {
      this.toastr.success('Vendor Deleted successfully', 'Success');
      this.departmentList[index] = updatedDepartment;
    },
      (error: any) => {
        console.error('Error Deleting Vendor:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }

}
