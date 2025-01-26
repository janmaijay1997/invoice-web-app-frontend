import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ExpenseTypeModalComponent } from 'src/app/components/expense-type-modal/expense-type-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { getLoginUserEmail } from 'src/app/utils/jwt-util';
import { UserService } from 'src/app/services/user.service';


interface Accounts {
  id: string;
  name: string;
  code: string;
}

interface Currency {
  id: string;
  currencyName: string;
  currencySymbol: string;
}

interface ExpenseCode {
  id: string;
  expenseCode: string;
  expenseName: string;
}

interface Submitter {
  id: string;
  name: string;
}


interface Department {
  id: string;
  departmentName: string;
  departmentManager: string;
  submitter: string;

}

interface CostCenter {
  id: string;
  code: string;
  name: string;
}

interface Vendor {
  id: string;
  vendorId: string;
  vendorName: string;
  bankDetails: BankDetails;
}

interface BankDetails {
  bankName: string;
  ibanNumber: string;
  bankAddress: string;
}


@Component({
  selector: 'app-petty-cash',
  templateUrl: './petty-cash.component.html',
  styleUrls: ['./petty-cash.component.scss']
})
export class PettyCashComponent implements OnInit {


  subTotal: number = 0;
  sidebarActive: boolean = false;
  recurrings = ['Yes', 'No'];
  vendorList: Vendor[] = [];
  expenseTypeList: ExpenseCode[] = [];
  costCenterList: CostCenter[] = [];
  accountsList: Accounts[] = [];
  currenciesList: Currency[] = [];
  submitterList: Submitter[] = [];
  departmentList: Department[] = [];
  paymentTypeList: string[] = [];
  invoiceStatus: string[] = [];
  subTotalAmount: number = 0; // Variable to keep track of the total amount
  invoiceCreateFormGroup: FormGroup;

  expenseTypeCategories: string[] = [];
  expenseTypeByCategory: Map<string, ExpenseCode[]> = new Map();

  constructor(private fb: FormBuilder,
    private commonService: CommonDetailsService,
    private invoiceService: InvoiceService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog) {
    this.invoiceCreateFormGroup = this.fb.group({
      invoiceNumber: [''],
      invoiceStatus: [''],
      accountType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      submitter: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      department: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      billTo: ['PETTY CASH', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentDueDate: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      vendorBankDetails: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      items: this.fb.array([this.itemFormGroup()]),  // Initialize the form array with one item,
      adjustments: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      subTotalAmount: [{ value: this.subTotalAmount, disabled: true }],

    });
  }

  ngOnInit(): void {
    this.getCommonDetailsData();
    this.getAllUsers();
    this.getUserDetails();
  }

  openExpenseTypeDialog(item: any): void {
    const dialogRef = this.dialog.open(ExpenseTypeModalComponent, {
      width: '400px',
      data: {
        categories: this.expenseTypeCategories,
        expenseTypeByCategory: this.expenseTypeByCategory
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Set the selected expense code into the form control
        item.get('expenseType').setValue(result.expenseCode);
      }
    });
  }
  // Getter for clientName
  get clientName() {
    return this.invoiceCreateFormGroup.get('clientName');
  }

  // Getter for accountType
  get accountType() {
    return this.invoiceCreateFormGroup.get('accountType');
  }

  get submitterName() {
    return this.invoiceCreateFormGroup.get('submitter');
  }

  get departmentName() {
    return this.invoiceCreateFormGroup.get('department');
  }

  get billTo() {
    return this.invoiceCreateFormGroup.get('billTo');
  }

  get vendorBankDetails() {
    return this.invoiceCreateFormGroup.get('vendorBankDetails');
  }

  get paymentDueDate() {
    return this.invoiceCreateFormGroup.get('paymentDueDate');
  }

  get adjustments() {
    return this.invoiceCreateFormGroup.get('adjustments');
  }

  get invoiceNumber() {
    return this.invoiceCreateFormGroup.get('invoiceNumber');
  }

  get invoiceStatusValue() {
    return this.invoiceCreateFormGroup.get('invoiceStatus');
  }
  // Getter for paymentType
  get paymentType() {
    return this.invoiceCreateFormGroup.get('paymentType');
  }

  // Getter for the FormArray (items)
  get items(): FormArray {
    return this.invoiceCreateFormGroup.get('items') as FormArray;
  }

  // Method to create a new FormGroup for an item
  itemFormGroup(): FormGroup {
    return this.fb.group({
      vendorInvoiceRef: ['', Validators.required],
      vendorName: ['', Validators.required],
      vendorId: ['', Validators.required], //
      vendorInvoiceDate: ['', Validators.required],
      costCode: ['', Validators.required],
      expenseType: ['', Validators.required],
      description: ['', Validators.required],
      rateOfSAR: ['1', Validators.required],
      currency: ['SAR', Validators.required],
      recurring: ['', Validators.required],
      invoiceTotal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],

      submitterName: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      itemAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subTotal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ptcAdvance: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      total: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }


  onVendorChange(event: Event, item: AbstractControl): void {
    const selectedVendor = (event.target as HTMLSelectElement).value;

    const vendor = this.vendorList.find(v => v.vendorName === selectedVendor);
    if (vendor) {
      item.get('vendorId')?.setValue(vendor.vendorId);
    }
  }


  onDateChange(event: Event, item: AbstractControl): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value; // This will be in YYYY-MM-DD format
    // Perform any modifications to the date as needed
    item.get('vendorInvoiceDate')?.setValue(selectedDate); // Update the FormGroup with the modified date
  }

  paymentDueDateType(event: Event): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value; // This will be in YYYY-MM-DD format
    this.paymentDueDate?.setValue(selectedDate);
  }

 
  navigateToInvoiceView(): void {
    this.router.navigate(['/InvoiceView']);
  }

  getTotalInvoiceAmount(): number {
    const items = this.items.value; // Get the array of items
    let total = 0;

    // Loop through each item and add the subTotal value
    items.forEach((item: any) => {
      const subTotal = parseFloat(item.total) || 0;
      total += subTotal;
    });

    const adjustments = parseFloat(this.adjustments?.value) || 0; // Get adjustments
    const grandTotal = total + adjustments; // Calculate grand total

    this.subTotalAmount = total;
    this.invoiceCreateFormGroup.get('subTotalAmount')?.setValue(total);
    this.invoiceCreateFormGroup.get('grandTotal')?.setValue(grandTotal); // Set grand total
    return total;
  }

  getTotalAmountWithAdjustment(): number {
    const adjustments = this.invoiceCreateFormGroup.get('adjustments')?.value || 0;
    const subTotal = this.getTotalInvoiceAmount();

    // Ensure both values are numbers
    const totalAdjustments = typeof adjustments === 'number' ? adjustments : parseFloat(adjustments) || 0;

    const grandTotal = subTotal + totalAdjustments;
    return grandTotal;
  }


  // Method to calculate the total invoice amount for the current row (recurring * rateofSAR)
  getTotalInvoiceAmountForRow(item: AbstractControl): void {
    const invoiceAmount = parseFloat(item.get('itemAmount')?.value) || 0;
    const quantity = parseFloat(item.get('quantity')?.value) || 0;
    const rateOfSAR = parseFloat(item.get('rateOfSAR')?.value) || 1;

    // Calculate subTotal
    this.subTotal = invoiceAmount * quantity * rateOfSAR;
    item.get('subTotal')?.setValue(this.subTotal);

    const ptcAdvance = parseFloat(item.get('ptcAdvance')?.value) || 0;
    const total = this.subTotal + ptcAdvance;
    item.get('total')?.setValue(total);

    // Update overall total whenever an item's total changes
    this.getTotalInvoiceAmount(); // Recalculate the grand total
  }




  // Method to add a new item to the FormArray
  addItem(): void {
    this.items.push(this.itemFormGroup());
    // Update the total whenever a new item is added
    this.subTotalAmount = this.getTotalInvoiceAmount();
  }

  // Method to remove an item from the FormArray
  removeItem(index: number): void {
    const removedItem = this.items.at(index); // Get the item to be removed
    const amount = parseFloat(removedItem.get('invoiceAmount')?.value); // Get the invoice amount of the removed item

    if (!isNaN(amount)) {
      this.subTotalAmount -= amount; // Subtract the amount from the total
    }

    this.items.removeAt(index); // Remove the item at the specified index
  }


  prepareItemsData(): any[] {
    return this.items.controls.map((item: AbstractControl) => {
      const formGroup = item as FormGroup;

      if (formGroup) {
        return {
          vendorInvoiceRef: formGroup.get('vendorInvoiceRef')?.value || '',
          vendorId: formGroup.get('vendorId')?.value || 'V1',
          vendorName: formGroup.get('vendorName')?.value || '',
          vendorInvoiceDate: formGroup.get('vendorInvoiceDate')?.value || '',
          costCode: formGroup.get('costCode')?.value || '',
          expenseType: formGroup.get('expenseType')?.value || '',
          description: formGroup.get('description')?.value || 'test',
          rateOfSAR: formGroup.get('rateOfSAR')?.value || '1.00',
          currency: formGroup.get('currency')?.value || 'USD',
          invoiceAmount: formGroup.get('invoiceAmount')?.value || '',
          recurring: formGroup.get('recurring')?.value || 'NO',
          invoiceTotal: formGroup.get('invoiceTotal')?.value || 0,


          submitterName: formGroup.get('submitterName')?.value || 0,
          itemAmount: formGroup.get('itemAmount')?.value || 0,
          quantity: formGroup.get('quantity')?.value || 0,
          subTotal: formGroup.get('subTotal')?.value || 0,
          ptcAdvance: formGroup.get('ptcAdvance')?.value || 0,
          total: formGroup.get('total')?.value || 0,
        };
      } else {
        // Handle the case where formGroup is null, if necessary
        return null;
      }
    }).filter(item => item !== null); // Filter out any null entries
  }


  selectedVendorBankDetails: BankDetails = {
    bankName: '',
    ibanNumber: '',
    bankAddress: ''
  };


  // Method to submit the invoice form
  saveInvoice() {
    const totalInvoiceAmount = this.getTotalInvoiceAmount();
    const submitterValue = `${this.userDetails.name} ${this.userDetails.surname}`;
    const department = this.userDetails.department;

    const requestData = {
      invoiceNumber: '',
      total: {
        subTotal: totalInvoiceAmount.toString(),
        adjustments: this.adjustments?.value || 0,
        grandTotal: (totalInvoiceAmount + this.adjustments?.value).toString(),
      },
      accountDetails: {
        accountType: this.accountType?.value || 'Private Account',
        paymentType: this.paymentType?.value || 'Bank',
      },

      submitter: {
        submitterName: submitterValue,
        department: department,
      },

      vendorDetails: {
        billTo: 'PETTY CASH',
        paymentDue: this.paymentDueDate?.value,
        vendorBankDetails: this.selectedVendorBankDetails,
      },

      invoiceStatus: this.invoiceStatus[0],
      createdBy: getLoginUserEmail(),
      items: this.prepareItemsData(),
    };

    this.invoiceService.createInvoice(requestData).subscribe((response: any) => {
      this.toastr.success('Invoice Created successFully with  invoice id ' + response.invoiceNumber, 'Success', {
        timeOut: 5000, // Optional - already set in forRoot
      });
      this.router.navigate(['/InvoiceView'])
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error(error.error, 'VALIDATION', {
        timeOut: 5000,
      });
    })
  }

  getCommonDetailsData() {
    this.commonService.getAllOtherDetails().subscribe(
      (response: any) => {
        this.costCenterList = response.costCenterList;
        this.expenseTypeList = response.expenseCodesList;
        this.currenciesList = response.currenciesList;
        this.accountsList = response.accountsList;
        this.departmentList = response.departmentList;
        this.paymentTypeList = response.paymentType;
        this.invoiceStatus = response.invoiceStatus;
        this.submitterList = response.submitterList;
        this.vendorList = response.vendorList;
        this.expenseTypeByCategory = new Map<string, ExpenseCode[]>(
          Object.entries(response.expenseTypeByCategory)
        );
        this.expenseTypeCategories = Array.from(this.expenseTypeByCategory.keys());

      },
      (error: any) => {
        console.error('Error fetching details:', error);
      }
    );
  }

  selectSubmitter(e: any) {
    const data = this.departmentList.find(data => data.submitter === e.target.value)?.departmentName;
    this.departmentName?.setValue(data)
  }

  userDetails: any;
  userDetailsList: any;


  getUserDetails() {
    let loggedInEmail = getLoginUserEmail();
    this.userService.getUserDetails(loggedInEmail).subscribe(
      (response: any) => {
        this.userDetails = response.data.userDetails;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }

  getAllUsers() {
    this.userService.getAllUserList().subscribe(
      (response: any) => {
        this.userDetailsList = response.data;
      },
      (error: any) => {
        console.error('Error fetching user details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
  }

  isVendorInvoiceRefAlreadyExistMessage = "";
  isVendorInvoiceRefAlreadyExist(e: any) {
    let vendorInvoiceRef = e.target.value;
    if (vendorInvoiceRef !== "") {
      this.invoiceService.isVendorInvoiceRefAlreadyExist(vendorInvoiceRef).subscribe((response: any) => {
        this.isVendorInvoiceRefAlreadyExistMessage = response.response;
      })
    }
  }

}
