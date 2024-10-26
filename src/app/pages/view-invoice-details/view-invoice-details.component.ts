import { SidebarService } from 'src/app/services/sidebar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceDataService } from 'src/app/services/invoicedataservice';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { extractRolesFromToken, getLoginUserEmail } from 'src/app/utils/jwt-util';
import { ExpenseTypeModalComponent } from 'src/app/components/expense-type-modal/expense-type-modal.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';

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
  selector: 'app-view-invoice-details',
  templateUrl: './view-invoice-details.component.html',
  styleUrls: ['./view-invoice-details.component.scss']
})

export class ViewInvoiceDetailsComponent implements OnInit {
  subTotal: number = 0;
  checkinvoiceStatus: any;
  subscription: Subscription | undefined;
  sidebarActive: boolean = false;
  isViewSubmitButton: boolean = true;
  invoiceStatusValue: string = '';
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
  userRole: any;

  expenseTypeCategories: string[] = [];
  expenseTypeByCategory: Map<string, ExpenseCode[]> = new Map();

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private commonService: CommonDetailsService,
    private invoiceService: InvoiceService,
    private toastr: ToastrService,
    public dialog: MatDialog,
    private invoiceDataService: InvoiceDataService,) {
    this.invoiceCreateFormGroup = this.fb.group({
      invoiceNumber: [''],
      accountType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      submitter: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      department: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      billTo: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentDueDate: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      vendorBankDetails: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      items: this.fb.array([this.itemFormGroup()]),  // Initialize the form array with one item,
      adjustments: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      subTotalAmount: [{ value: this.subTotalAmount, disabled: true }],

    });
  }

  ngOnInit(): void {
    this.userRole = extractRolesFromToken()[0];
    this.getCommonDetailsData();
    this.route.queryParams.subscribe(params => {
      const invoiceNumber = params['invoiceNumber'];
      // Fetch the invoice data using the invoiceId
      this.viewInvoice(invoiceNumber);

    });

    const invoice = this.invoiceDataService.getInvoice();

    if (invoice) {
      this.invoiceCreateFormGroup.get("invoiceNumber")?.setValue(invoice.invoiceNumber);
      if (invoice.invoiceStatus === 'SUBMITTED') {
        this.isViewSubmitButton = false;
        this.invoiceCreateFormGroup.disable();
      }
      this.populateForm(invoice);
    } else {
      this.addItem();
    }

  }
  viewInvoice(invoiceId: string) {
    this.invoiceService.getInvoiceDetails(invoiceId).subscribe(
      (response: any) => {
        const invoice = response;
        this.checkinvoiceStatus = response.invoiceStatus;
        this.populateForm(invoice);
      },
      (error: any) => {
        console.error('Error fetching details:', error);
        this.toastr.error('Something went wrong.', 'Error');
      }
    );
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

  // Inside your component class
  isCostCodeCustom(index: number): boolean {
    const item = this.items.at(index).value;
    return !this.costCenterList.some(center => center.code === item.costCode);
  }

  isExpenseTypeCustom(index: number): boolean {
    const item = this.items.at(index).value;
    return !this.expenseTypeList.some(center => center.expenseCode === item.expenseType);
  }

  isVendorCustom(index: number): boolean {
    const item = this.items.at(index).value;
    return !this.vendorList.some(center => center.vendorName === item.vendorName);
  }

  isCurrencyCustom(index: number): boolean {
    const item = this.items.at(index).value;
    return !this.currenciesList.some(center => center.currencyName === item.currency);
  }

  isAccountTypeCustom(): boolean {
    const accountType = this.accountType?.value;
    return accountType && !this.accountsList.some(dept => dept.name === accountType);
  }

  isBillToCustom(): boolean {
    const billTo = this.billTo?.value;
    return billTo && !this.vendorList.some(dept => dept.vendorName === billTo);
  }

  isSubmitterCustom(): boolean {
    const submitter = this.invoiceCreateFormGroup.get('submitter')?.value;
    return submitter && !this.departmentList.some(dept => dept.submitter === submitter);
  }


  private populateForm(invoice: any): void {
    this.invoiceCreateFormGroup.patchValue({
      invoiceNumber: invoice.invoiceNumber,
      accountType: invoice.accountDetails.accountType,
      paymentType: invoice.accountDetails.paymentType,
      submitter: invoice.submitter.submitterName,
      department: invoice.submitter.department,
      billTo: invoice.vendorDetails.billTo,
      paymentDueDate: invoice.vendorDetails.paymentDue,
      vendorBankDetails: invoice.vendorDetails.vendorBankDetails,
      invoiceStatus: invoice.invoiceStatus,
      adjustments: invoice.total.adjustments || '0', // Handle optional adjustments
    });

    this.selectedVendorBankDetails = this.invoiceCreateFormGroup.get('vendorBankDetails')?.value;
    this.items.clear();

    if (invoice.items) {
      invoice.items.forEach((item: any) => {
        const itemGroup = this.itemFormGroup();
        itemGroup.patchValue({
          vendorInvoiceRef: item.vendorInvoiceRef,
          vendorName: item.vendorName,
          vendorId: item.vendorId,
          vendorInvoiceDate: item.vendorInvoiceDate,
          costCode: item.costCode,
          expenseType: item.expenseType,
          description: item.description,
          rateOfSAR: item.rateOfSAR,
          currency: item.currency,
          recurring: item.recurring,
          invoiceAmount: item.invoiceAmount,
          invoiceTotal: item.invoiceTotal,

          submitterName: item.submitterName,
          itemAmount: item.itemAmount,
          quantity: item.quantity,
          subTotal: item.subTotal,
          ptcAdvance: item.ptcAdvance,
          total: item.total,

        });
        const costCodeExists = this.costCenterList.some(center => center.code === item.costCode);
        if (!costCodeExists) {
          itemGroup.get('costCode')?.setValue(item.costCode);
        }

        this.items.push(itemGroup); // Add the item to the FormArray
      });



    }
    if (invoice.invoiceStatus == 'SUBMITTED') {
      this.invoiceCreateFormGroup.disable()
    }
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

  get paymentDueDate() {
    return this.invoiceCreateFormGroup.get('paymentDueDate');
  }

  get adjustments() {
    return this.invoiceCreateFormGroup.get('adjustments');
  }

  get invoiceNumber() {
    return this.invoiceCreateFormGroup.get('invoiceNumber');
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
      rateOfSAR: ['', Validators.required],
      currency: ['', Validators.required],
      recurring: ['', Validators.required],
      invoiceAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],  // Pattern for numeric values
      invoiceTotal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],


      submitterName: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      itemAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      subTotal: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      ptcAdvance: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      total: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
    });
  }

  getExpenseTypeLabel(i: number): string {
    const expenseTypeControl = this.items.at(i)?.get('expenseType');
    if (this.isExpenseTypeCustom(i)) {
      return expenseTypeControl?.value || 'Select Expense Type';
    } else {
      const expenseType = this.expenseTypeList.find(exp => exp.expenseCode === expenseTypeControl?.value);
      return expenseType ? expenseType.expenseCode : 'Select Expense Type';
    }
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

  getTotalInvoiceAmount(): number {
    const items = this.items.value; // Get the array of items
    let total = 0;

    // Loop through each item and add the invoiceTotal value
    items.forEach((item: any) => {
      const amount = parseFloat(item.invoiceTotal);
      if (!isNaN(amount)) {
        total += amount;
      }
    });

    this.subTotalAmount = total;
    this.invoiceCreateFormGroup.get('subTotalAmount')?.setValue(total);
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
    const invoiceAmount = parseFloat(item.get('invoiceAmount')?.value) || 0; // Fallback to 0
    const rateOfSAR = parseFloat(item.get('rateOfSAR')?.value) || 0; // Fallback to 0

    if (!isNaN(invoiceAmount) && !isNaN(rateOfSAR)) {
      const total = invoiceAmount * rateOfSAR;
      item.get('invoiceTotal')?.setValue(total);
    } else {
      console.warn("Invalid values for invoiceAmount or rateOfSAR in row:", item.value);
    }

    // Update the overall total whenever an item's total changes
    this.getTotalInvoiceAmount();
  }


  // Method to calculate the total invoice amount for the current row (recurring * rateofSAR)
  getTotalInvoiceAmountForRowPettyCash(item: AbstractControl): void {
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
    this.getTotalInvoiceAmountPettyCash(); // Recalculate the grand total
  }



  getTotalInvoiceAmountPettyCash(): number {
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

  getTotalAmountWithOutPettyCash(): number {
    const adjustments = this.invoiceCreateFormGroup.get('adjustments')?.value || 0;
    const subTotal = this.getTotalInvoiceAmount();

    // Ensure both values are numbers
    const totalAdjustments = typeof adjustments === 'number' ? adjustments : parseFloat(adjustments) || 0;

    const grandTotal = subTotal + totalAdjustments;
    return grandTotal;
  }

  getTotalAmountWithAdjustmentPettyCash() {
    const adjustments = this.invoiceCreateFormGroup.get('adjustments')?.value || 0;
    const subTotal = this.getTotalInvoiceAmountPettyCash();

    // Ensure both values are numbers
    const totalAdjustments = typeof adjustments === 'number' ? adjustments : parseFloat(adjustments) || 0;

    const grandTotal = subTotal + totalAdjustments;
    return grandTotal;
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
          currency: formGroup.get('currency')?.value || '',
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


  // Method to submit the invoice form
  saveInvoice() {
    var totalInvoiceAmount;
    if (this.billTo?.value === "PETTY CASH") {
      totalInvoiceAmount = this.getTotalInvoiceAmountPettyCash();
    } else {
      totalInvoiceAmount = this.getTotalInvoiceAmount();
    }
    const requestData = {
      invoiceNumber: this.invoiceNumber?.value,
      total: {
        subTotal: totalInvoiceAmount.toString(),
        adjustments: this.adjustments?.value | 0,
        grandTotal: totalInvoiceAmount + Number(this.adjustments?.value || 0),
      },
      accountDetails: {
        accountType: this.accountType?.value || 'Private Account',
        paymentType: this.paymentType?.value || 'Bank',
      },
      submitter: {
        submitterName: this.submitterName?.value,
        department: this.departmentName?.value,
      },

      vendorDetails: {
        billTo: this.billTo?.value,
        paymentDue: this.paymentDueDate?.value,
        vendorBankDetails: this.selectedVendorBankDetails,
      },

      invoiceStatus: this.invoiceStatus[0],
      updatedBy: getLoginUserEmail(), 
      items: this.prepareItemsData(),
    };

    this.invoiceService.createInvoice(requestData).subscribe((response: any) => {
      this.toastr.success('Invoice Saved successFully with  invoice id ' + response.invoiceNumber, 'Success', {
        timeOut: 5000, // Optional - already set in forRoot
      });
      this.invoiceCreateFormGroup.reset();
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error(error.error, 'VALIDATION', {
        timeOut: 5000,
      });
    })
  }

  private getInvoiceAlertDetails(type: any) {
    if (type === "REJECTED") {
      return {
        title: 'Do you want to Reject Invoice?',
        text: "Rejected Invoice needs to be resolved by the creator of the Invoice.",
        confirmButtonText: 'Yes, Reject it!',
      };
    } else {
      return {
        title: 'Do you want to Submit Invoice?',
        text: "You won't be able to change once submitted!",
        confirmButtonText: 'Yes, Submit it!',
      };
    }
  }

  submitInvoice(type: any) {
    const { title, text, confirmButtonText } = this.getInvoiceAlertDetails(type);

    Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: confirmButtonText,
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        var totalInvoiceAmount;
        if (this.billTo?.value === "PETTY CASH") {
          totalInvoiceAmount = this.getTotalInvoiceAmountPettyCash();
        } else {
          totalInvoiceAmount = this.getTotalInvoiceAmount();
        }
        const requestData = {
          invoiceNumber: this.invoiceNumber?.value,
          total: {
            subTotal: totalInvoiceAmount.toString(),
            adjustments: this.adjustments?.value,
            grandTotal: totalInvoiceAmount + Number(this.adjustments?.value || 0),
          },
          accountDetails: {
            accountType: this.accountType?.value || '',
            paymentType: this.paymentType?.value || '',
          },
          submitter: {
            submitterName: this.submitterName?.value,
            department: this.departmentName?.value,
          },

          vendorDetails: {
            billTo: this.billTo?.value,
            paymentDue: this.paymentDueDate?.value,
            vendorBankDetails: this.selectedVendorBankDetails,
          },

          invoiceStatus: type === 'SUBMITTED' ? this.invoiceStatus[1] : this.invoiceStatus[2],
          updatedBy: getLoginUserEmail(), 
          items: this.prepareItemsData(),
        };

        this.invoiceService.createInvoice(requestData).subscribe((response: any) => {
          this.toastr.success(`Invoice ${ type === 'SUBMITTED' ? this.invoiceStatus[1] : this.invoiceStatus[2]} successFully with  invoice id ` + response.invoiceNumber, 'Success', {
            timeOut: 5000, // Optional - already set in forRoot
          });
          this.invoiceCreateFormGroup.reset();
        }, (error: any) => {
          console.error('Error fetching details:', error);
          this.toastr.error(error.error, 'VALIDATION', {
            timeOut: 5000,
          });
        })
      }
    });
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

  onSubmitterChangeEvent(event: any) {
    const selectedSubmitter = event.target.value; // Get the value of the selected submitter
    const department = this.departmentList.find(dept => dept.submitter === selectedSubmitter)?.departmentName;

    if (department) {
      this.invoiceCreateFormGroup.get('department')?.setValue(department);
    }
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

  defaultBankDetails: BankDetails = {
    bankName: '',
    ibanNumber: '',
    bankAddress: ''
  };

  selectedVendorBankDetails: BankDetails = this.defaultBankDetails;

  onVendorChangeEvent(e: any) {
    const foundDetails = this.vendorList.find(data => data.vendorName === e.target.value)?.bankDetails;
    if (foundDetails) {
      this.selectedVendorBankDetails = foundDetails;
      console.log(this.selectedVendorBankDetails);
    } else {
      console.error("No bank details found for the selected vendor.");
      // Optionally reset to default or handle the absence of details
    }
  }

}