import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddInvoiceComponent } from 'src/app/pages/add-invoice/add-invoice.component';


interface ExpenseCode {
  id: string;
  category: string;
  expenseCode: string;
  expenseName: string;
}


@Component({
  selector: 'app-expense-type-modal',
  templateUrl: './expense-type-modal.component.html',
  styleUrls: ['./expense-type-modal.component.scss']
})
export class ExpenseTypeModalComponent {

  selectedCategory: string = '';
  selectedExpenseCode: string = '';

  constructor(
    public dialogRef: MatDialogRef<ExpenseTypeModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: string[], expenseTypeByCategory: Map<string, ExpenseCode[]> }
  ) { }

  // Method to handle category change and fetch corresponding expense types
  onCategoryChange(category: string) {
    this.selectedCategory = category;
  }

  // Method to close dialog and return selected data
  onSelectExpenseCode(expenseCode: string) {
    this.selectedExpenseCode = expenseCode;
    this.dialogRef.close({ category: this.selectedCategory, expenseCode: this.selectedExpenseCode });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
