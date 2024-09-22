import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonDetailsService } from 'src/app/services/common-details.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { ToastrService } from 'ngx-toastr';


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

interface CostCenter {
  id: string;
  code: string;
  name: string;
}

interface Vendor {
  vendorId: string;
  name: string;
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
  recurrings=['Yes','No'];
  vendorList:any;
  expenseTypeList: any;
  costCenterList: any;
  currenciesList: any;
  totalInvoiceAmount: number = 0; // Variable to keep track of the total amount

  invoiceCreateFormGroup: FormGroup;

  constructor(private fb: FormBuilder,private commonService:CommonDetailsService,private invoiceService:InvoiceService,private toastr: ToastrService) {
    this.invoiceCreateFormGroup = this.fb.group({
      clientName: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      items: this.fb.array([this.itemFormGroup()]),  // Initialize the form array with one item,
      accountType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      totalDue: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
      paymentType: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],  // Allow multiple letters in client name
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

  // Getter for totalDue
  get totalDue() {
    return this.invoiceCreateFormGroup.get('totalDue');
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
      vendor: [null, Validators.required],
      costCode: ['', Validators.required],
      expenseType: ['', Validators.required],
      rateOfSAR: ['', Validators.required],
      recurring: ['', Validators.required],
      description: ['', Validators.required],
      currency: ['', Validators.required],
      invoiceAmount: ['', [Validators.required, Validators.pattern('^[0-9]+$')]]  // Pattern for numeric values
    });
  }

  // Method to calculate the total invoice amount
  getTotalInvoiceAmount(): number {
    const items = this.items.value; // Get the array of items
    let total = 0;

    // Loop through each item and add the invoiceAmount value
    items.forEach((item: any) => {
      const amount = parseFloat(item.invoiceAmount); // Parse the value as float
      if (!isNaN(amount)) {
        total += amount; // Add to the total if it's a valid number
      }
    });

    return total; // Return the total sum
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
        adjustments: '0.00',  // Dummy value for adjustments
        grandTotal: '$ ' + (totalInvoiceAmount * 10).toString(),  // Example dummy value for grand total (just for illustration)
      },
      accountDue: {
        accountType: this.accountType?.value || 'Private Account',  // Use form value, or a dummy value
        totalDue: this.totalDue?.value.toString()|| 1,  // Dummy calculation for total due
        paymentType: this.paymentType?.value || 'Bank',  // Use form value, or a dummy value
      },
      submitter: {
        submitterName: 'Samad',  // Dummy value
        department: 'Telecom',  // Dummy value
      },
      items: this.items.value.map((item: any, index: number) => ({
        refId: (index + 1).toString(),  // Dummy value for refId, incrementing index
        vendorInvoiceRef: item.vendorInvoiceRef || '',  // Use form value
        vendorId: item.vendor.id,  // Dummy vendor ID
        vendorName:  item.vendor.name,  // Dummy vendor name
        vendorInvoiceDate: '2023-04-22',  // Dummy date
        invoiceAmount: item.invoiceAmount || '',  // Use form value
        recurring: item.recurring || 'NO',  // Use form value
        costCode: item.costCode || '',  // Use form value
        expenseType: item.expenseType || '',  // Use form value
        description: item.description || 'test',  // Use form value or dummy
        currency: item.currency || 'USD',  // Use form value or dummy
        rateOfSAR: item.rateOfSAR || '1.00',  // Use form value or dummy
      }))
    };
  
    console.log(requestData);  // Log the final requestData JSON object

    this.invoiceService.createInvoice(requestData).subscribe((response:any)=>{
        console.log(response);
this.toastr.success('Invoice Created successFully with  invoice id '+response.response.invoiceNumber, 'Success', {
      timeOut: 300000, // Optional - already set in forRoot
    });
            this.invoiceCreateFormGroup.reset();
    },(error: any) => {
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
      },
      (error: any) => {
        console.error('Error fetching details:', error);
      }
    );
  }
}