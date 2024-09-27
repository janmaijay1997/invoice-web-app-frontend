import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ToastrService } from 'ngx-toastr';

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
  code: string;
  type: string;
}

interface Submitter {
  id: string;
  name: string;
}


interface Department {
  id: string;
  name: string;
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
}

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})

export class AddInvoiceComponent implements OnInit {

  sidebarActive: boolean = false;


  vendors = [
    { id: '1', name: 'Vendor 1' },
    { id: '2', name: 'Vendor 2' },
    { id: '3', name: 'Vendor 3' }
  ];


  costCodes = ['CostCode1', 'CostCode2', 'CostCode3'];
  expenseCodes = ['ExpenseCode1', 'ExpenseCode2', 'ExpenseCode3'];
  units = ['PCS', 'KG', 'Litre'];
  currencies = ['USD', 'EUR', 'GBP'];
  recurrings = ['Yes', 'No'];
  vendorList: any;
  expenseTypeList: ExpenseCode[] = [];
  costCenterList: CostCenter[] = [];
  accountsList: Accounts[] = [];
  currenciesList: Currency[] = [];
  submitterList: Submitter[] = [];
  departmentList: Department[] = [];
  paymentTypeList: string[] = [];
  invoiceStatus: string[] = [];
  totalInvoiceAmount: number = 0; // Variable to keep track of the total amount

  invoiceCreateFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private commonService: CommonDetailsService, private invoiceService: InvoiceService, private toastr: ToastrService) {
    this.invoiceCreateFormGroup = this.fb.group({
      clientName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      items: this.fb.array([this.itemFormGroup()]),  // Initialize the form array with one item,
      accountType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      submitter: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      department: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name

      billTo: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentDueDate: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      adjustments: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      invoiceTotal: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
    });
  }
  ngOnInit(): void {
    this.getCommonDetailsData();
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
      vendorInvoiceDate: ['', Validators.required],  // Ensure this is present
      costCode: ['', Validators.required],
      expenseType: ['', Validators.required],
      description: ['', Validators.required],
      rateOfSAR: ['', Validators.required],
      currency: ['', Validators.required],
      recurring: ['', Validators.required],
      invoiceAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],  // Pattern for numeric values
      invoiceTotal: [{ value: '', disabled: true }], // Disabled field, calculated value
    });
  }


  onDateChange(event: Event, item: AbstractControl): void {
    const input = event.target as HTMLInputElement;
    const selectedDate = input.value; // This will be in YYYY-MM-DD format
    // Perform any modifications to the date as needed
    item.get('vendorInvoiceDate')?.setValue(selectedDate); // Update the FormGroup with the modified date
  }


  // Method to calculate the total invoice amount
  getTotalInvoiceAmount(): number {
    const items = this.items.value; // Get the array of items
    let total = 0;

    // Loop through each item and add the invoiceAmount value
    items.forEach((item: any) => {
      const amount = parseFloat(item.invoiceTotal); // Parse the value as float
      if (!isNaN(amount)) {
        total += amount; // Add to the total if it's a valid number
      }
    });
    return total; // Return the total sum
  }



  // Method to calculate the total invoice amount for the current row (recurring * rateofSAR)
  getTotalInvoiceAmountForRow(item: AbstractControl): void {
    const invoiceAmount = parseFloat(item.get('invoiceAmount')?.value) || 0; // Fallback to 0
    const rateOfSAR = parseFloat(item.get('rateOfSAR')?.value) || 0; // Fallback to 0

    const total = invoiceAmount * rateOfSAR;
    item.get('invoiceTotal')?.setValue(total); // Store the total in invoiceTotal
  }



  // Method to add a new item to the FormArray
  addItem(): void {
    this.items.push(this.itemFormGroup());
    // Update the total whenever a new item is added
    this.totalInvoiceAmount = this.getTotalInvoiceAmount();
  }

  // Method to remove an item from the FormArray
  removeItem(index: number): void {
    const removedItem = this.items.at(index); // Get the item to be removed
    const amount = parseFloat(removedItem.get('invoiceAmount')?.value); // Get the invoice amount of the removed item

    if (!isNaN(amount)) {
      this.totalInvoiceAmount -= amount; // Subtract the amount from the total
    }

    this.items.removeAt(index); // Remove the item at the specified index
  }

  // Method to submit the invoice form
  submitInvoice() {
    console.log(this.items);
    const totalInvoiceAmount = this.getTotalInvoiceAmount(); // Calculate the total amount

    const requestData = {
      invoiceNumber: '',  // Dummy value for invoice number
      total: {
        subTotal: totalInvoiceAmount.toString(),  // Use the calculated totalInvoiceAmount
        adjustments: this.adjustments?.value,  // Dummy value for adjustments
        grandTotal: '$' + (totalInvoiceAmount + this.adjustments?.value).toString(),  // Example dummy value for grand total (just for illustration)
      },
      accountDetails: {
        accountType: this.accountType?.value || 'Private Account',  // Use form value, or a dummy value
        paymentType: this.paymentType?.value || 'Bank',  // Use form value, or a dummy value
      },
      submitter: {
        submitterName: this.submitterName?.value,
        department: this.departmentName?.value,
      },

      vendorDetails: {
        billTo: this.billTo?.value,
        paymentDue: this.paymentDueDate?.value,
        vendorBankDetails: this.departmentName?.value || 'Refer Invoice',
      },

      invoiceStatus: "PENDING", // TODO
      createdBy: "ADMIN",  // TODO pass value from session name

      items: this.items.value.map((item: any, index: number) => ({
        vendorInvoiceRef: item.vendorInvoiceRef || '',  // Use form value
        vendorId: item.vendor.id?.value,  // Dummy vendor ID
        vendorName: item.vendor.name?.value,  // Dummy vendor name
        vendorInvoiceDate: item.vendorInvoiceDate?.value || '',  // Use form value
        invoiceAmount: item.invoiceAmount?.value || '',  // Use form value
        recurring: item.recurring?.value || 'NO',  // Use form value
        costCode: item.costCode?.value || '',  // Use form value
        expenseType: item.expenseType?.value || '',  // Use form value
        description: item.description?.value || 'test',  // Use form value or dummy
        currency: item.currency?.value || 'USD',  // Use form value or dummy
        rateOfSAR: item.rateOfSAR?.value || '1.00',  // Use form value or dummy
        invoiceTotal: item.invoiceTotal,
      }))
    };

    console.log(requestData);  // Log the final requestData JSON object

    this.invoiceService.createInvoice(requestData).subscribe((response: any) => {
      console.log(response);
      this.toastr.success('Invoice Created successFully with  invoice id ' + response.response.invoiceNumber, 'Success', {
        timeOut: 300000, // Optional - already set in forRoot
      });
      this.invoiceCreateFormGroup.reset();
    }, (error: any) => {
      console.error('Error fetching details:', error);
      this.toastr.error('Something went wrong.', 'Error');

    })


  }

  getCommonDetailsData() {
    this.commonService.getAllOtherDetails().subscribe(
      (response: any) => {
        this.costCenterList = response.response.costCenterList;
        this.expenseTypeList = response.response.expenseCodesList;
        this.currenciesList = response.response.currenciesList;
        this.accountsList = response.response.accountsList;
        this.departmentList = response.response.departmentList;
        this.paymentTypeList = response.response.paymentType;
        this.invoiceStatus = response.response.invoiceStatus;
        this.submitterList = response.response.submitterList;

      },
      (error: any) => {
        console.error('Error fetching details:', error);
      }
    );
  }
}