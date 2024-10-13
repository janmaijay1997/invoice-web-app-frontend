import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { SidebarService } from 'src/app/services/sidebar.service';
import Swal from 'sweetalert2';


interface CostCenter {
  id: number,
  name: string;
  code: string;
  description: string;
}

interface ExpenseType {
  id: number,
  category: string;
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
  editVendorModal = false;

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

  expenseTypeByCategory: Map<string, ExpenseType[]> = new Map();
  categoryList = ['COMMUNICATIONS', 'EMPLOYEES', 'MEMBERSHIP AND DESCRIPTION', 'OFFICE SUPPLIES', 'OTHERS'];


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
      description: ['', Validators.required],
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
      address: new FormControl(''),
      vendorName: new FormControl(''),
      phoneNumber: new FormControl(''),
      bankDetails: this.fb.group({
        bankName: new FormControl(''),
        ibanNumber: new FormControl(''),
        bankAddress: new FormControl(''),
      }),
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

  openAddCostCenterModal(event: Event) {
    event.stopPropagation(); // Prevent the accordion toggle
    this.newCostCenterForm.reset();
    this.showAddCostCenterModel = true;
  }
  closeAddCostCenterModel() {
    this.showAddCostCenterModel = false;
  }


  openAddExpenseTypeModal(event: Event) {
    event.stopPropagation(); // Prevent the accordion toggle
    this.newExpenseTypeForm.reset();
    this.showAddExpenseTypeModal = true;
  }
  closeExpenseTypeModal() {
    this.showAddExpenseTypeModal = false;
  }

  openAddDepartmentsModal(event: Event) {
    event.stopPropagation(); // Prevent the accordion toggle
    this.newDepartmentForm.reset();
    this.showAddDepartmenteModal = true;
  }
  closeDepartmentsModal() {
    this.showAddDepartmenteModal = false;
  }

  openAddVendorModal(event: Event) {
    event.stopPropagation(); // Prevent the accordion toggle
    this.newVendorForm.reset();
    this.showAddVendorModal = true;
  }
  closeVendorModal() {
    this.showAddVendorModal = false;
    this.editVendorModal = false;
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
          description: [newCostCenter.description]
        }));
      } else {
        this.costCenters.push(this.fb.group({
          name: [newCostCenter.name],
          code: [newCostCenter.code],
          description: [newCostCenter.description],
        }));
      }

      this.commonDetailsService.createCostCenter(newCostCenter).subscribe(
        (response: any) => {
          this.toastr.success('Cost Center created successfully', 'Success');
          this.getCostCenterList();
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
      id: index.id,
      name: index.name,
      code: index.code,
      description: index.description,
    });
    this.showAddCostCenterModel = true;
  }

  // Fetch the cost center list and populate the form array
  async getCostCenterList() {
    this.commonDetailsService.getCostCenterList().subscribe(
      (response: any) => {
        this.costCenterList = response;
      },
      (error: any) => {
        console.error('Error fetching Cost Center list:', error);
        this.toastr.error('Failed to fetch Cost Center list.', 'Error');
      }
    );
  }

  saveCostCenter(index: number) {
    const updatedCostCenter = this.costCenters.at(index).value;

    this.commonDetailsService.createCostCenter(updatedCostCenter).subscribe((response: any) => {
      this.toastr.success('Cost Center saved successfully', 'Success');
      this.costCenterList[index] = updatedCostCenter;
      this.getCostCenterList();
    },
      (error: any) => {
        console.error('Error saving Cost Center:', error.error);
        this.toastr.warning(error.error, 'Error');
      }
    );
  }

  deleteCostCenter(index: any) {
    Swal.fire({
      title: 'Do you want to delete Cost Center?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedCostCenter = index.id;

        this.commonDetailsService.deleteCostCenter(updatedCostCenter).subscribe(
          (response: any) => {
            this.toastr.success('Cost Center Deleted successfully', 'Success');
            this.getCostCenterList();
          },
          (error: any) => {
            console.error('Error Deleting Cost Center:', error.error);
            this.toastr.warning(error.error, 'Error');
          }
        );
      }
    });
  }



  // -----------------------------------------ExpenseType-------------------------------------------------------

  createExpenseType() {
    if (this.newExpenseTypeForm.valid) {
      const newExpenseType = this.newExpenseTypeForm.value;

      if (newExpenseType.id) {
        // Push the new cost center into the form array
        this.expenseTypes.push(this.fb.group({
          id: [newExpenseType.id],
          category: [newExpenseType.category],
          expenseName: [newExpenseType.type],
          expenseCode: [newExpenseType.code],
        }));

      } else {
        // Push the new cost center into the form array
        this.expenseTypes.push(this.fb.group({
          category: [newExpenseType.category],
          expenseName: [newExpenseType.type],
          expenseCode: [newExpenseType.code],
        }));
      }

      this.commonDetailsService.createExpenseType(newExpenseType).subscribe(
        (response: any) => {
          this.toastr.success('Expense Type created successfully', 'Success');
          this.getExpenseTypeList();
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
      id: index.id,
      category: index.category,
      expenseName: index.expenseName,
      expenseCode: index.expenseCode,
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
        category: [expenseType.category],
        expenseName: [expenseType.expenseName],
        expenseCode: [expenseType.expenseCode]
      });
      this.expenseTypes.push(group);
    });
  }



  deleteExpenseType(index: any) {
    Swal.fire({
      title: 'Do you want to delete Expense Type?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedExpenseType = index.id;

        this.commonDetailsService.deleteExpenseTypes(updatedExpenseType).subscribe((response: any) => {
          this.toastr.success('Expense Type Deleted successfully', 'Success');
          this.expenseTypeList[index] = updatedExpenseType;
          this.getExpenseTypeList();
        },
          (error: any) => {
            console.error('Error Deleting Expense Type:', error.error);
            this.toastr.warning(error.error, 'Error');
          }
        );
      }
    });
  }

  // ------------------------Department------------------------------//


  createDepartments() {
    if (this.newDepartmentForm.valid) {
      const newDepartmentName = this.newDepartmentForm.value;

      if (newDepartmentName.id) {
        // Push the new Department into the form array
        this.costCenters.push(this.fb.group({
          id: [newDepartmentName.id],
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
          this.getDepartmentsList();
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
      id: index.id,
      departmentName: index.departmentName,
      departmentManager: index.departmentManager,
      submitter: index.submitter,
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


  deleteDepartment(index: any) {
    Swal.fire({
      title: 'Do you want to delete Department ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDepartment = index.id;

        this.commonDetailsService.deleteDepartments(updatedDepartment).subscribe((response: any) => {
          this.toastr.success('Department Deleted successfully', 'Success');
          this.getDepartmentsList();
        },
          (error: any) => {
            console.error('Error Deleting Department:', error.error);
            this.toastr.warning(error.error, 'Error');
          }
        );
      }
    });
  }


  // -----------------vendor API-----------------------

  createVendor() {
    if (this.newVendorForm.valid) {
      const newVendor = this.newVendorForm.value;
      console.log(newVendor);

      this.commonDetailsService.createVendor(newVendor).subscribe(
        (response: any) => {
          this.toastr.success('Vendor created successfully', 'Success');
          this.closeVendorModal(); // Close the modal
          this.getVendorList();
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

  editVendor(index: any) {
    console.log('..........', index);

    this.editVendorModal = true;

    this.newVendorForm.setValue({
      vendorId: index.id,
      vendorName: index.vendorName,
      address: index.address,
      phoneNumber: index.phoneNumber,
      bankDetails: {
        bankName: index.bankDetails.bankName,
        ibanNumber: index.bankDetails.ibanNumber,
        bankAddress: index.bankDetails.bankAddress
      },
    });
    this.showAddVendorModal = true;
  }

  async getVendorList() {
    this.commonDetailsService.getVendorList().subscribe(
      (response: any) => {
        this.vendorList = response;
      },
      (error: any) => {
        console.error('Error fetching Vendor list:', error);
        this.toastr.error('Failed to fetch Vendor list.', 'Error');
      }
    );
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


  deleteVendor(index: any) {
    Swal.fire({
      title: 'Do you want to delete Vendor ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedDepartment = index.id;

        this.commonDetailsService.deleteVendor(updatedDepartment).subscribe((response: any) => {
          this.toastr.success('Vendor Deleted successfully', 'Success');
          this.departmentList[index] = updatedDepartment;
          this.getVendorList();
        },
          (error: any) => {
            console.error('Error Deleting Vendor:', error.error);
            this.toastr.warning(error.error, 'Error');
          }
        );
      }
    });
  }

}
